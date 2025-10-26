import { getCurrentUserId } from "@/lib/session";
import { getUserDiscussions } from "@/services/discussion";
import { DiscussionTable } from "@/components/app/discussions/discussion-table";
import { DiscussionForm } from "@/components/app/discussions/discussion-form";

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
