import { getCurrentUser } from "@/lib/session";
import { getDiscussionById } from "@/services/discussion";
import { DiscussionDetail } from "@/components/app/discussions/discussion-detail";

interface DiscussionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiscussionsPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  const discussion = await getDiscussionById(id);
  const currentUser = await getCurrentUser();

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  return <DiscussionDetail discussion={discussion} discussionId={id} currentUser={currentUser} />;
}
