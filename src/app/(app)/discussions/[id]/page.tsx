import DiscussionDetail from "@/components/pages/app/discussions/DiscussionDetail";
import { getDiscussionById } from "@/services/discussion";

interface DiscussionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiscussionsPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  const discussion = await getDiscussionById(id);

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  return <DiscussionDetail discussion={discussion} discussionId={id} />;
}
