"use client";

import Image from "next/image";
import useSWR, { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { LeaderboardResponse } from "@/types/leaderboard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Leaderboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFrozen, setIsFrozen] = useState(false);
  const { mutate } = useSWRConfig();
  const limit = 5;
  const { data, error, isLoading } = useSWR<LeaderboardResponse>(
    `/api/leaderboard?page=${currentPage}&limit=${limit}`,
    fetcher,
    { 
      refreshInterval: isFrozen ? 0 : 5000 
    }
  );

  useEffect(() => {
    if (data?.meta?.isFrozen !== undefined) {
      setIsFrozen(data.meta.isFrozen);
    }
  }, [data]);

  useEffect(() => {
    pusherClient.subscribe("leaderboard-channel");
    pusherClient.subscribe("contest-channel");

    const handleLeaderboardUpdate = () => {
      mutate(`/api/leaderboard?page=${currentPage}&limit=${limit}`);
    };

    const handleContestStatusUpdate = () => {
      mutate(`/api/leaderboard?page=${currentPage}&limit=${limit}`);
    };

    pusherClient.bind("leaderboard-update", handleLeaderboardUpdate);
    pusherClient.bind("status-update", handleContestStatusUpdate);

    return () => {
      pusherClient.unbind("leaderboard-update", handleLeaderboardUpdate);
      pusherClient.unbind("status-update", handleContestStatusUpdate);
      pusherClient.unsubscribe("leaderboard-channel");
      pusherClient.unsubscribe("contest-channel");
    };
  }, [mutate, currentPage]);

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
  const totalPages = data?.meta?.totalPages || 1;
  const startRank = (currentPage - 1) * limit + 1;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Image
        src={"/logos/LeaderboardText.webp"}
        width={400}
        height={400}
        className="w-[40%] h-auto"
        alt="nplc-leaderboard"
      ></Image>
      {isFrozen && (
        <div className="w-full text-center py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-none">
          <span className="text-yellow-500 font-bold text-lg [text-shadow:_0_0_20px_rgba(255,255,0,0.8)]">
            LEADERBOARD FROZEN
          </span>
        </div>
      )}
      <div className="w-full flex flex-col gap-4">
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
                  <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
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
                        #{startRank + index}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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

        {/* Pagination Controls */}
        {users.length > 0 && (
          <div className="flex justify-between items-center px-4 py-2 bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-2 py-2 font-semibold transition-colors ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed opacity-50"
                  : "text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] hover:bg-[#222251]"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className={`px-2 py-2 font-semibold transition-colors ${
                currentPage >= totalPages
                  ? "text-gray-500 cursor-not-allowed opacity-50"
                  : "text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] hover:bg-[#222251]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
