"use client";

import useSWR, { useSWRConfig } from "swr";
import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";

interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
  score: number;
}

interface LeaderboardResponse {
  data: LeaderboardUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Leaderboard() {
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<LeaderboardResponse>(
    "/api/leaderboard?page=1&limit=10",
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    pusherClient.subscribe("leaderboard-channel");

    const handleLeaderboardUpdate = () => {
      mutate("/api/leaderboard?page=1&limit=10");
    };

    pusherClient.bind("leaderboard-update", handleLeaderboardUpdate);

    return () => {
      pusherClient.unbind("leaderboard-update", handleLeaderboardUpdate);
      pusherClient.unsubscribe("leaderboard-channel");
    };
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="w-full text-center text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] text-xl py-8">
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-500 [text-shadow:_0_0_20px_rgba(255,0,0,1)] text-xl py-8">
        Failed to load leaderboard.
      </div>
    );
  }

  const users = data?.data || [];

  return (
    <div className="w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] overflow-x-auto">
      {!users || users.length === 0 ? (
        <p className="text-center py-8 text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)]">
          No participants yet.
        </p>
      ) : (
        <table className="min-w-full divide-y divide-[#FCF551] w-full">
          <thead className="bg-[#18182a]/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#18182a]/80 divide-y divide-[#FCF551]/75">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-[#222251] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[#FCF551] [text-shadow:_0_0_20px_rgba(252,245,81,1)] font-bold text-2xl">
                    #{index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base">
                    {user.name || "Anonymous"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-[#FCF551] [text-shadow:_0_0_20px_rgba(252,245,81,1)] font-bold text-lg">
                    {user.score} pts
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
