import Leaderboard from "@/components/pages/leaderboard/Leaderboard";
import Image from "next/image";

export default async function LeaderboardPage() {
  return (
    <div className="z-[3] w-full justify-start items-center flex flex-col">
      <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 px-4 mt-24">
        <Image
          src={"/logos/LeaderboardText.webp"}
          width={400}
          height={400}
          className="w-[40%] h-auto"
          alt="nplc-leaderboard"
        ></Image>
        <Leaderboard />
      </div>
    </div>
  );
}
