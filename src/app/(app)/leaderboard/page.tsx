import Leaderboard from "@/components/pages/app/leaderboard/Leaderboard";
import { ContestGuard } from "@/components/layout/ContestGuard";

export default async function LeaderboardPage() {
  return (
    <>
      <ContestGuard />
      <Leaderboard />
    </>
  );
}
