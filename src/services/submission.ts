"use server";

import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { getAuthSession } from "@/lib/session";
import { getLanguageId } from "@/utils/language";
import {
  SubmitCodeParams,
  SubmitCodeResult,
  Judge0Submission,
  Judge0Response,
} from "@/types/submission";
import { Status } from "@prisma/client";

export async function submitCode({
  problemId,
  sourceCode,
  language,
}: SubmitCodeParams): Promise<SubmitCodeResult> {
  try {
    if (!process.env.JUDGE0_API_URL) {
      console.error("JUDGE0_API_URL is not configured");
      return {
        success: false,
        error: "Judge0 service is not configured",
      };
    }

    const session = await getAuthSession();

    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!problemId || !sourceCode || !language) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const languageId = getLanguageId(language);
    if (!languageId) {
      return {
        success: false,
        error: "Unsupported language",
      };
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return {
        success: false,
        error: "Problem not found",
      };
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

      console.log("Judge0 response:", {
        status_id: result.status?.id || result.status_id,
        status_description: result.status?.description,
        message: result.message,
        compile_output: result.compile_output,
        stderr: result.stderr,
        stdout: result.stdout,
        time: result.time,
        memory: result.memory,
        token: result.token,
      });

      const statusId = result.status?.id || result.status_id || 0;

      // ✅ CHECK MEMORY LIMIT FIRST - Sebelum pengecekan status lainnya
      if (result.memory && result.memory > problem.memoryLimit * 1024) {
        console.log(
          `❌ Memory Limit Exceeded: ${result.memory} MB > ${
            problem.memoryLimit * 1024
          } MB`
        );

        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            status: Status.MEMORY_LIMIT_EXCEEDED,
            memory: result.memory,
            judge0Token: result.token,
          },
        });

        return {
          success: true,
          submissionId: submission.id,
          status: Status.MEMORY_LIMIT_EXCEEDED,
          testResults: [
            {
              passed: false,
              memory: result.memory,
              status: Status.MEMORY_LIMIT_EXCEEDED,
              stderr: result.stderr,
              stdout: result.stdout,
            },
          ],
          passed: false,
          error: "Memory Limit Exceeded",
          message: getStatusDescription(Status.MEMORY_LIMIT_EXCEEDED),
        };
      }

      // Setelah itu baru check error lainnya
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

        let errorMessage = result.message || "Execution error";
        let errorStatus = mapJudge0Status(statusId);

        if (
          result.compile_output ||
          (result.stderr && result.stderr.includes("SyntaxError"))
        ) {
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

        return {
          success: true,
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
        };
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

      const testCaseNumber = testResults.length;
      console.log(
        `Test Case ${testCaseNumber}: ${passed ? "✓ PASSED" : "✗ FAILED"}`,
        {
          status: finalStatus,
          time: result.time,
          memory: result.memory,
          memoryLimit: problem.memoryLimit * 1024, // ✅ Tambahkan log ini
        }
      );

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

        return {
          success: true,
          submissionId: submission.id,
          status: finalStatus,
          testResults,
          passed: false,
          compileOutput: result.compile_output,
          stderr: result.stderr,
          stdout: result.stdout,
          message: getStatusDescription(finalStatus),
        };
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

    return {
      success: true,
      submissionId: submission.id,
      status: Status.ACCEPTED,
      testResults,
      passed: true,
      time: avgTime,
      memory: maxMemory,
    };
  } catch (error) {
    console.error("Submission error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return {
      success: false,
      error: "Submission processing failed",
      message: errorMessage,
    };
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
    case 15: // Judge0 status ID untuk memory limit exceeded
      return Status.MEMORY_LIMIT_EXCEEDED;
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
    case Status.MEMORY_LIMIT_EXCEEDED:
      return "Memory Limit Exceeded - Code used too much memory";
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
