import AdminDashboard from "@/components/pages/admin/AdminDashboard";
import ContestTimer from "@/components/pages/app/leaderboard/ContestTimer";
import { getActiveContest } from "@/services/contest";

export default async function AdminPage() {
  const initialContestState = await getActiveContest();

  return (
    <div className="container mx-auto px-4 py-8 z-[4]">
      <h1 className="text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
      <p className="text-center text-gray-400 mb-8">Contest Management</p>

      <ContestTimer />
      <AdminDashboard initialContestState={initialContestState} />
    </div>
  );
}
