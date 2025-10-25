import DiscussionDetail from "@/components/pages/app/discussions/DiscussionDetail";
import { getDiscussionById } from "@/services/discussion";
import { getCurrentUser } from "@/lib/session";

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
