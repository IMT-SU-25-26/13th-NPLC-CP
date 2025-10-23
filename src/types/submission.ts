import { Status, type Submission } from "@prisma/client";

export { Status };

export interface TestResult {
  passed: boolean;
  time?: number;
  memory?: number;
  status: Status;
  compileOutput?: string | null;
  stderr?: string | null;
  stdout?: string | null;
}

export interface SubmissionResponse
  extends Pick<Submission, "time" | "memory"> {
  submissionId: Submission["id"];
  status: Status;
  testResults: TestResult[];
  passed: boolean;
  error?: string;
  message?: string;
  compileOutput?: string | null;
  stderr?: string | null;
  stdout?: string | null;
}

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: string;
  memory_limit?: number;
}

export interface Judge0Response {
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

export interface SubmitCodeParams {
  problemId: string;
  sourceCode: string;
  language: string;
}

export interface SubmitCodeResult {
  success: boolean;
  submissionId?: string;
  status?: Status;
  testResults?: Array<{
    passed: boolean;
    time?: number;
    memory?: number;
    status: Status;
    compileOutput?: string | null;
    stderr?: string | null;
    stdout?: string | null;
  }>;
  passed?: boolean;
  time?: number;
  memory?: number;
  error?: string;
  message?: string;
  compileOutput?: string | null;
  stderr?: string | null;
  stdout?: string | null;
}
