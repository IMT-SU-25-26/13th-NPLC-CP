import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Status } from "@prisma/client";

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

    const session = await getServerSession(authOptions);

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
      compileOutput?: string | null;
      stderr?: string | null;
      stdout?: string | null;
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

      if (
        result.message ||
        result.compile_output ||
        (result.stderr && statusId !== 3)
      ) {
        console.error("Judge0 execution error:", {
          message: result.message,
          compileOutput: result.compile_output,
          stderr: result.stderr,
          statusId,
          token: result.token,
        });

        let errorStatus: Status = Status.INTERNAL_ERROR;
        let errorMessage = result.message || "";

        if (
          result.message &&
          (result.message.includes("language") ||
            result.message.includes("Language"))
        ) {
          errorStatus = Status.INTERNAL_ERROR;
          errorMessage = "Invalid language configuration";
        } else if (
          result.compile_output ||
          (result.stderr && result.stderr.includes("SyntaxError"))
        ) {
          errorStatus = Status.COMPILATION_ERROR;
          errorMessage =
            result.compile_output ||
            result.stderr ||
            result.message ||
            "Compilation error";
        } else if (result.stderr && statusId >= 7 && statusId <= 12) {
          errorStatus = mapJudge0Status(statusId);
          errorMessage = result.stderr;
        } else if (statusId === 6) {
          errorStatus = Status.COMPILATION_ERROR;
          errorMessage =
            result.compile_output || result.message || "Compilation error";
        }

        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status: errorStatus,
            judge0Token: result.token,
          },
        });

        return NextResponse.json({
          submissionId: submission.id,
          status: errorStatus,
          testResults: [
            {
              passed: false,
              status: errorStatus,
              compileOutput: result.compile_output,
              stderr: result.stderr,
              stdout: result.stdout,
            },
          ],
          passed: false,
          error: errorMessage,
          message: getStatusDescription(errorStatus),
        });
      }

      const status = mapJudge0Status(statusId);
      const passed = statusId === 3;

      let finalStatus = status;
      if (
        status === Status.INTERNAL_ERROR &&
        (result.compile_output ||
          (result.stderr && result.stderr.includes("SyntaxError")))
      ) {
        finalStatus = Status.COMPILATION_ERROR;
      }

      testResults.push({
        passed,
        time: result.time ? parseFloat(result.time) : undefined,
        memory: result.memory ?? undefined,
        status: finalStatus,
        compileOutput: result.compile_output,
        stderr: result.stderr,
        stdout: result.stdout,
      });

      if (!passed) {
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status: finalStatus,
            time: result.time ? parseFloat(result.time) : undefined,
            memory: result.memory ?? undefined,
            judge0Token: result.token,
          },
        });

        return NextResponse.json({
          submissionId: submission.id,
          status: finalStatus,
          testResults,
          passed: false,
          compileOutput: result.compile_output,
          stderr: result.stderr,
          stdout: result.stdout,
          message: getStatusDescription(finalStatus),
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
        problem.points - wrongAttempts * PENALTY_POINTS
      );

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          score: { increment: pointsEarned },
          lastSubmission: submission.createdAt,
        },
      });

      await pusherServer.trigger(
        "leaderboard-channel",
        "leaderboard-update",
        {}
      );
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

function getStatusDescription(status: Status): string {
  switch (status) {
    case Status.PENDING:
      return "Submission is pending";
    case Status.PROCESSING:
      return "Code is being processed";
    case Status.ACCEPTED:
      return "Accepted - All test cases passed";
    case Status.WRONG_ANSWER:
      return "Wrong Answer - Output doesn't match expected result";
    case Status.TIME_LIMIT_EXCEEDED:
      return "Time Limit Exceeded - Code took too long to execute";
    case Status.COMPILATION_ERROR:
      return "Compilation Error - Code failed to compile";
    case Status.RUNTIME_ERROR_SIGSEGV:
      return "Runtime Error - Segmentation fault (invalid memory access)";
    case Status.RUNTIME_ERROR_SIGXFSZ:
      return "Runtime Error - File size limit exceeded";
    case Status.RUNTIME_ERROR_SIGFPE:
      return "Runtime Error - Floating point exception";
    case Status.RUNTIME_ERROR_SIGABRT:
      return "Runtime Error - Program aborted";
    case Status.RUNTIME_ERROR_NZEC:
      return "Runtime Error - Non-zero exit code";
    case Status.RUNTIME_ERROR_OTHER:
      return "Runtime Error - Other runtime error";
    case Status.INTERNAL_ERROR:
      return "Internal Error - System error occurred";
    case Status.EXEC_FORMAT_ERROR:
      return "Execution Format Error - Invalid executable format";
    default:
      return "Unknown status";
  }
}
