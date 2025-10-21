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
