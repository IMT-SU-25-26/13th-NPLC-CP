import DiscussionForm from "@/components/pages/discussions/DiscussionForm";
import DiscussionTable from "@/components/pages/discussions/DiscussionTable";
import { authOptions } from "@/lib/auth";
import { getCurrentUserId } from "@/lib/session";
import { getUserDiscussions } from "@/services/discussion";

export default async function UserDiscussionsPage() {
  const userId = await getCurrentUserId();

  const discussions = await getUserDiscussions(userId);

  return (
    <div className="z-[3] w-full justify-start items-center flex flex-col">
      <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 mt-24">
        <DiscussionForm />
        <h1 className="text-2xl font-bold">Your Discussions</h1>
        <DiscussionTable discussions={discussions} />
      </div>
    </div>
  );
}
