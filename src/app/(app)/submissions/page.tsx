import SubmissionTable from "@/components/pages/app/submissions/SubmissionTable";
import { ContestGuard } from "@/components/layout/ContestGuard";
import { getSubmissionByUserId } from "@/lib/services/submissions";
import { getCurrentUserId } from "@/lib/session";

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
