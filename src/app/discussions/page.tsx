import Image from "next/image";
import Link from "next/link";
import { getAllDiscussions } from "@/services/discussion";

export default async function DiscussionsPage() {
  const discussions = await getAllDiscussions();

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
      <div className="z-[1] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-[1100px] h-[900px] rounded-full blur-[100px]"></div>
      <div className="z-[3] w-full justify-start items-center flex flex-col">
        <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 px-4">
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
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Asked By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
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
                        {discussion.question}
                      </Link>
                    </td>
                    <td className="px-6 py-4 max-w-[40ch] truncate text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {discussion.question}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {new Date(discussion.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {discussion.author?.name ?? "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {discussion.replies?.length ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
