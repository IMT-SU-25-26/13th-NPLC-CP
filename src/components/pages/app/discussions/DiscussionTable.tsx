"use client";

import { FullDiscussion } from "@/types/db";
import { useRouter } from "next/navigation";

interface DiscussionsTableProps {
  discussions: FullDiscussion[];
}

export default function DiscussionTable({ discussions }: DiscussionsTableProps) {
  const router = useRouter();

  return (
    <div className="relative z-[50] w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap">
      <table className="min-w-full divide-y divide-[#FCF551] w-full ">
        <thead className="bg-[#18182a]/80">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
              Content
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
              Asked By
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
              Replies
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#18182a]/80 divide-y divide-[#FCF551]/75">
          {discussions.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium"
              >
                No discussions yet.
              </td>
            </tr>
          ) : (
            discussions.map((discussion) => (
              <tr
                key={discussion.id}
                className="hover:bg-[#222251] hover:cursor-pointer transition-colors relative"
                onClick={() => router.push(`/discussions/${discussion.id}`)}
              >
                <td className="px-6 py-4 max-w-[30ch] truncate text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base">
                  {discussion.title}
                </td>
                <td className="px-6 py-4 max-w-[40ch] truncate text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                  {discussion.question}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                  {new Date(discussion.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                  {discussion.author?.name ?? "Unknown"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                  {discussion.replies?.length ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
