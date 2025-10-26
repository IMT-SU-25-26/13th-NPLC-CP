import { ContestGuard } from "@/components/layout/contest-guard";
import { Leaderboard } from "@/components/app/leaderboard/leaderboard";

export default async function LeaderboardPage() {
  return (
    <>
      <ContestGuard />
      <Leaderboard />
    </>
  );
}
