import Link from "next/link";
import Image from "next/image";
import { getDiscussionById } from "@/services/discussion";

interface DiscussionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiscussionsPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  const discussion = await getDiscussionById(id);

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  const adminReplies =
    discussion.replies?.filter((r) => r.author.role === "ADMIN") || [];
  const userReplies =
    discussion.replies?.filter((r) => r.author.role !== "ADMIN") || [];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
      <div className="z-[3] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px]"></div>
      <Image
        src={"/backgrounds/BangunanDepanUngu.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[2] w-full h-auto absolute bottom-[0]"
      />
      <Image
        src={"/backgrounds/BangunanBelakangBiru.svg"}
        alt="blue"
        width={100}
        height={100}
        className="z-[1] w-full h-auto absolute bottom-[0]"
      />
      <Image
        src={"/backgrounds/Stairs.svg"}
        alt="stairs"
        width={100}
        height={100}
        className="z-[4] w-full h-auto absolute bottom-[-2.5%]"
      />
      <div className="z-[2] w-full h-auto absolute bottom-[0]">
        <div className="z-[1] w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
        <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-[1100px] h-[900px] rounded-full blur-[100px]"></div>
      </div>
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
              <div className="flex items-start gap-3 mt-2">
                <div className="flex-1">
                  <textarea
                    placeholder="Tulis balasan..."
                    className="w-full bg-transparent border border-[#3f3f61] rounded-md p-2 text-sm text-white placeholder:text-[#9fb7bd] resize-none h-20"
                  />
                  <div className="flex justify-end mt-2">
                    <button className="bg-[#FCF551] text-black px-4 py-1 rounded-md font-semibold">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
