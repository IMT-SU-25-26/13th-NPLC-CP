import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Status } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const LANGUAGE_MAP: Record<string, number> = {
  cpp: 54, // C++ (GCC 9.2.0)
  // c: 50, // C (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  python: 71, // Python (3.8.1)
  // javascript: 63, // JavaScript (Node.js 12.14.0)
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
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

export async function POST(request: NextRequest) {
  try {
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

      const submitResponse = await fetch(
        `${process.env.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "",
            "X-RapidAPI-Host": process.env.JUDGE0_API_HOST || "",
          },
          body: JSON.stringify(judge0Submission),
        }
      );

      if (!submitResponse.ok) {
        throw new Error("Judge0 submission failed");
      }

      const result: Judge0Response = await submitResponse.json();

      const status = mapJudge0Status(result.status?.id || 0);
      const passed = result.status?.id === 3;

      testResults.push({
        passed,
        time: result.time ? parseFloat(result.time) : undefined,
        memory: result.memory,
        status,
      });

      if (!passed) {
        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status,
            time: result.time ? parseFloat(result.time) : undefined,
            memory: result.memory,
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

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: Status.ACCEPTED,
        time: avgTime,
        memory: maxMemory,
      },
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
    return NextResponse.json(
      { error: "Internal server error" },
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
