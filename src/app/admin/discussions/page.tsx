import DiscussionTable from "@/components/pages/discussions/DiscussionTable";
import { getAllDiscussions } from "@/services/discussion";

export default async function DiscussionsPage() {
  const discussions = await getAllDiscussions();

  return (
    <div className="z-[3] w-full justify-start items-center flex flex-col">
      <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 mt-24">
        <DiscussionTable discussions={discussions} />
      </div>
    </div>
  );
}
