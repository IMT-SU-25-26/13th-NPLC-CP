import Link from "next/link";
import { FullDiscussion } from "@/types/db";

interface DiscussionsPageProps {
  discussions: FullDiscussion[];
}

export default function DiscussionTable({ discussions }: DiscussionsPageProps) {
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
          {discussions.map((discussion) => (
            <tr
              key={discussion.id}
              className="hover:bg-[#222251] hover:cursor-pointer transition-colors relative"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/discussions/${discussion.id}`}
                  className="text-[#75E8F0] hover:underline [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base"
                >
                  {discussion.title}
                </Link>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
