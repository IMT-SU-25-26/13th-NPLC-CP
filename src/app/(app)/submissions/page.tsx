import SubmissionTable from "@/components/pages/app/submissions/SubmissionTable";
import { getSubmissionByUserId } from "@/services/submissions";
import { getCurrentUserId } from "@/lib/session";
import { checkContest } from "@/lib/guard";

export default async function SubmissionPage() {
  await checkContest();

  const userId = await getCurrentUserId();

  const submissions = await getSubmissionByUserId(userId);

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 lg:px-16 py-8 space-y-6">
      <SubmissionTable submissions={submissions} />
    </div>
  );
}
