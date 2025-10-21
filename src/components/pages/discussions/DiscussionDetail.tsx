import Link from "next/link";
import ReplyForm from "@/components/pages/discussions/ReplyForm";
import { FullDiscussion } from "@/types/db";

interface DiscussionDetailProps {
  discussion: FullDiscussion;
  discussionId: string;
}

export default function DiscussionDetail({
  discussion,
  discussionId,
}: DiscussionDetailProps) {
  const adminReplies =
    discussion.replies?.filter((r) => r.author.role === "ADMIN") || [];
  const userReplies =
    discussion.replies?.filter((r) => r.author.role !== "ADMIN") || [];

  return (
    <div className="z-[3] w-full justify-start items-center flex flex-col">
      <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 px-4">
        <div className="z-[50] w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] p-4">
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <Link
                  href="#"
                  className="font-semibold text-white hover:underline text-sm md:text-base"
                >
                  {discussion.author?.name || "Anonymous"}
                </Link>
                <span className="text-[#B9C0FF] text-xs">
                  •{" "}
                  {discussion.createdAt
                    ? new Date(discussion.createdAt).toLocaleString()
                    : ""}
                </span>
              </div>
              <p className="text-sm text-[#DFF7FA] mt-1">
                {discussion.question}
              </p>
            </div>

            {/* Admin Replies */}
            {adminReplies.map((reply, idx) => (
              <div
                key={reply.id || idx}
                className="flex flex-col gap-1 border-l-4 border-[#FCF551] pl-4 bg-[#23233a]/60 rounded"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#FCF551] text-sm md:text-base">
                    Admin
                  </span>
                  <Link
                    href="#"
                    className="font-semibold text-white hover:underline text-sm md:text-base"
                  >
                    {reply.author?.name || "Admin"}
                  </Link>
                  <span className="text-[#B9C0FF] text-xs">
                    •{" "}
                    {reply.createdAt
                      ? new Date(reply.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-[#DFF7FA] mt-1">{reply.content}</p>
              </div>
            ))}

            {/* User Replies */}
            {userReplies.map((reply, idx) => (
              <div key={reply.id || idx} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Link
                    href="#"
                    className="font-semibold text-white hover:underline text-sm md:text-base"
                  >
                    {reply.author?.name || "User"}
                  </Link>
                  <span className="text-[#B9C0FF] text-xs">
                    •{" "}
                    {reply.createdAt
                      ? new Date(reply.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className="text-sm text-[#DFF7FA] mt-1">{reply.content}</p>
              </div>
            ))}

            {/* Reply Input */}
            <ReplyForm discussionId={discussionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
