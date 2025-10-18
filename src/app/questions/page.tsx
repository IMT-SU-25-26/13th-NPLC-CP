import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
export default async function page() {
  const discussions = await prisma.discussion.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
      <div className="z-[3] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px]"></div>
      <Image
        src={"/backgrounds/BangunanDepanUngu.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[2] w-full h-auto absolute bottom-[0]"
      ></Image>
      <Image
        src={"/backgrounds/BangunanBelakangBiru.svg"}
        alt="purple"
        width={100}
        height={100}
        className=" z-[1] w-full h-auto absolute bottom-[0]"
      ></Image>
      <Image
        src={"/backgrounds/Stairs.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[4] w-full h-auto absolute bottom-[-2.5%]"
      ></Image>
      <div className="relative z-[50] text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg text-[#75E8F0] overflow-x-auto whitespace-nowrap">
        {discussions && discussions.length > 0 ? (
          <table className="min-w-full divide-y divide-[#FCF551] w-full ">
            <thead className="bg-[#18182a]/80">
              <tr className="">
                <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#18182a]/80 divide-y divide-[#FCF551]/75">
              {discussions.map((discussions) => (
                <tr
                  key={discussions.id}
                  className="hover:bg-[#222251] hover:cursor-pointer transition-colors relative"
                >
                  {/* <Link href={`/problems/${problem.slug}`} className="absolute cursor-pointer w-full h-full"></Link> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/problems/${discussions.id}`}
                      className="text-[#75E8F0] hover:underline [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base"
                    >
                      {discussions.content}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/problems/${discussions.id}`}
                      className="text-[#75E8F0] hover:underline [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base"
                    >
                      {discussions.user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                    <Link
                      href={`/problems/${discussions.id}`}
                      className="text-[#75E8F0] hover:underline [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center p-10 text-center max-w-7xl">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] text-xl">
                No discussions available yet
              </p>
              <Link
                href="/questions/create"
                className="px-6 py-3 bg-[#FCF551]/20 border-2 border-[#FCF551] rounded-md text-[#75E8F0] hover:bg-[#FCF551]/30 transition-colors text-base"
              >
                Create a new discussion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
