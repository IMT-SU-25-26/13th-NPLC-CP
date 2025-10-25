import DiscussionForm from "@/components/pages/app/discussions/DiscussionForm";
import DiscussionTable from "@/components/pages/app/discussions/DiscussionTable";
import { getCurrentUserId } from "@/lib/core/session";
import { getUserDiscussions } from "@/lib/services/discussion";

export default async function UserDiscussionsPage() {
  const userId = await getCurrentUserId();

  const discussions = await getUserDiscussions(userId);

  return (
    <>
      <DiscussionForm />
      <h1 className="text-2xl font-bold">Your Discussions</h1>
      <DiscussionTable discussions={discussions} />
    </>
  );
}
