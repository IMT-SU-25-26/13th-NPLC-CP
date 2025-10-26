import { getCurrentUserId } from "@/lib/session";
import { getSubmissionByUserId } from "@/services/submissions";
import { ContestGuard } from "@/components/layout/contest-guard";
import { SubmissionTable } from "@/components/app/submissions/submission-table";

export default async function SubmissionPage() {
  const userId = await getCurrentUserId();

  const submissions = await getSubmissionByUserId(userId);

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-16 py-8 space-y-6">
      <ContestGuard />
      <SubmissionTable submissions={submissions} />
    </div>
  );
}
