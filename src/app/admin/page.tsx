import { getAllDiscussions } from "@/services/discussion";
import { getActiveContest } from "@/services/contest";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { ContestTimer } from "@/components/app/leaderboard/contest-timer";
import { DiscussionTable } from "@/components/app/discussions/discussion-table";

export default async function AdminPage() {
  const initialContestState = await getActiveContest();
  const discussions = await getAllDiscussions();

  return (
    <div className="container mx-auto px-4 py-8 z-[4] mt-24">
      <h1 className="text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
      <p className="text-center text-gray-400 mb-8">Contest Management</p>

      <ContestTimer />
      <AdminDashboard initialContestState={initialContestState} />
      <div className="max-w-[75%] mx-auto">
        <DiscussionTable discussions={discussions} />
      </div>
    </div>
  );
}
