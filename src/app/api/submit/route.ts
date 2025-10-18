import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { Status } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const LANGUAGE_MAP: Record<string, number> = {
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  python: 71, // Python (3.8.1)
};

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: string;
  memory_limit?: number;
}

interface Judge0Response {
  token: string;
  status?: {
    id: number;
    description: string;
  };
  status_id?: number;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | null;
  memory?: number | null;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.JUDGE0_API_URL) {
      console.error("JUDGE0_API_URL is not configured");
      return NextResponse.json(
        { error: "Judge0 service is not configured" },
        { status: 500 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { problemId, sourceCode, language } = body;

    if (!problemId || !sourceCode || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const languageId = LANGUAGE_MAP[language.toLowerCase()];
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    await prisma.language.upsert({
      where: { id: languageId },
      update: {},
      create: { id: languageId, name: language },
    });

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        languageId,
        sourceCode,
        status: Status.PENDING,
      },
    });

    const testResults: Array<{
      passed: boolean;
      time?: number;
      memory?: number;
      status: Status;
    }> = [];

    for (const testCase of problem.testCases) {
      const judge0Submission: Judge0Submission = {
        source_code: sourceCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.expectedOutput,
        cpu_time_limit: problem.timeLimit.toString(),
        memory_limit: problem.memoryLimit * 1024,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (process.env.JUDGE0_API_KEY) {
        headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
      }
      if (process.env.JUDGE0_API_HOST) {
        headers["X-RapidAPI-Host"] = process.env.JUDGE0_API_HOST;
      }

      const submitResponse = await fetch(
        `${process.env.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true&fields=*`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(judge0Submission),
        }
      );

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        console.error("Judge0 submission failed:", {
          status: submitResponse.status,
          statusText: submitResponse.statusText,
          error: errorText,
        });
        throw new Error(
          `Judge0 submission failed: ${submitResponse.status} ${submitResponse.statusText}`
        );
      }

      const result: Judge0Response = await submitResponse.json();

      const statusId = result.status?.id || result.status_id || 0;

      if (result.message) {
        console.error("Judge0 execution error:", {
          message: result.message,
          statusId,
          token: result.token,
        });
        throw new Error(`Judge0 execution error: ${result.message}`);
      }

      const status = mapJudge0Status(statusId);
      const passed = statusId === 3;

      testResults.push({
        passed,
        time: result.time ? parseFloat(result.time) : undefined,
        memory: result.memory ?? undefined,
        status,
      });

      if (!passed) {
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status,
            time: result.time ? parseFloat(result.time) : undefined,
            memory: result.memory ?? undefined,
            judge0Token: result.token,
          },
        });

        return NextResponse.json({
          submissionId: submission.id,
          status,
          testResults,
          passed: false,
        });
      }
    }

    const avgTime =
      testResults.reduce((sum, r) => sum + (r.time || 0), 0) /
      testResults.length;
    const maxMemory = Math.max(...testResults.map((r) => r.memory || 0));

    await prisma.$transaction(async (prisma) => {
      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          status: Status.ACCEPTED,
          time: avgTime,
          memory: maxMemory,
        },
      });

      const priorSolves = await prisma.submission.count({
        where: {
          userId: session.user.id,
          problemId: problem.id,
          status: Status.ACCEPTED,
          id: { not: submission.id },
        },
      });

      if (priorSolves > 0) {
        return;
      }

      const PENALTY_POINTS = 10;
      
      const wrongAttempts = await prisma.submission.count({
        where: {
          userId: session.user.id,
          problemId: problem.id,
          status: Status.WRONG_ANSWER,
          createdAt: { lt: submission.createdAt },
        },
      });

      const pointsEarned = Math.max(
        0,
        problem.points - wrongAttempts * PENALTY_POINTS,
      );

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          score: { increment: pointsEarned },
          lastSubmission: submission.createdAt,
        },
      });

      await pusherServer.trigger("leaderboard-channel", "leaderboard-update", {});
    });

    return NextResponse.json({
      submissionId: submission.id,
      status: Status.ACCEPTED,
      testResults,
      passed: true,
      time: avgTime,
      memory: maxMemory,
    });
  } catch (error) {
    console.error("Submission error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error: "Submission processing failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

function mapJudge0Status(statusId: number): Status {
  switch (statusId) {
    case 1:
    case 2:
      return Status.PROCESSING;
    case 3:
      return Status.ACCEPTED;
    case 4:
      return Status.WRONG_ANSWER;
    case 5:
      return Status.TIME_LIMIT_EXCEEDED;
    case 6:
      return Status.COMPILATION_ERROR;
    case 7:
      return Status.RUNTIME_ERROR_SIGSEGV;
    case 8:
      return Status.RUNTIME_ERROR_SIGXFSZ;
    case 9:
      return Status.RUNTIME_ERROR_SIGFPE;
    case 10:
      return Status.RUNTIME_ERROR_SIGABRT;
    case 11:
      return Status.RUNTIME_ERROR_NZEC;
    case 12:
      return Status.RUNTIME_ERROR_OTHER;
    case 13:
      return Status.INTERNAL_ERROR;
    case 14:
      return Status.EXEC_FORMAT_ERROR;
    default:
      return Status.INTERNAL_ERROR;
  }
}
