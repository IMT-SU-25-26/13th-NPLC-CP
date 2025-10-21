import Leaderboard from "@/components/pages/app/leaderboard/Leaderboard";
import { checkContest } from "@/lib/guard";

export default async function LeaderboardPage() {
  await checkContest();

  return <Leaderboard />;
}
