import Link from "next/link";
import ReplyForm from "@/components/pages/app/discussions/ReplyForm";
import { FullDiscussion } from "@/types/db";

interface DiscussionDetailProps {
  discussion: FullDiscussion;
  discussionId: string;
  currentUser: {
    id: string;
    role: string;
  };
}

export default function DiscussionDetail({
  discussion,
  discussionId,
  currentUser,
}: DiscussionDetailProps) {
  const sortedReplies = discussion.replies?.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }) || [];

  const canReply = currentUser.role === "ADMIN" || currentUser.id === discussion.authorId;

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
              <p className="text-sm text-[#DFF7FA] mt-1 whitespace-pre-wrap">
                {discussion.question}
              </p>
            </div>

            {sortedReplies.map((reply, idx) => {
              const isAdmin = reply.author.role === "ADMIN";
              return isAdmin ? (
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
                  <p className="text-sm text-[#DFF7FA] mt-1 whitespace-pre-wrap">{reply.content}</p>
                </div>
              ) : (
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
                  <p className="text-sm text-[#DFF7FA] mt-1 whitespace-pre-wrap">{reply.content}</p>
                </div>
              );
            })}

            {canReply ? (
              <ReplyForm discussionId={discussionId} />
            ) : (
              <div className="text-center text-sm text-[#9fb7bd] italic mt-2 p-3 bg-[#23233a]/40 rounded border border-[#3f3f61]">
                Only the discussion author and admins can reply to this discussion.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
