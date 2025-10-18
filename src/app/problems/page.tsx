import Link from "next/link";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function ProblemsPage() {
  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-600 border-1 border-green-500";
      case "MEDIUM":
        return "text-yellow-600 border-1 border-yellow-500";
      case "HARD":
        return "text-red-600 border-1 border-red-500";
      default:
        return "text-gray-600 border-1 border-gray-500";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
      <div className="z-[3] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px]"></div>
      <Image
        src={"/backgrounds/BangunanDepanUngu.svg"}
        alt="purple"
        width={100}
        height={100}
        draggable={false}
        className="z-[2] w-full h-auto absolute bottom-[0]"
      ></Image>
      <Image
        src={"/backgrounds/BangunanBelakangBiru.svg"}
        alt="purple"
        width={100}
        height={100}
        draggable={false}
        className=" z-[1] w-full h-auto absolute bottom-[0]"
      ></Image>
      <Image
        src={"/backgrounds/Stairs.svg"}
        alt="purple"
        width={100}
        height={100}
        draggable={false}
        className="z-[4] w-full h-auto absolute bottom-[-2.5%]"
      ></Image>
      <div className="z-[1] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-[1100px] h-[900px] rounded-full blur-[100px]"></div>
      <div className="z-[5] w-full justify-start items-center flex flex-col">
        <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 px-4">
          <Image
            src={"/logos/ProblemsTitle.svg"}
            alt="purple"
            width={100}
            height={100}
            draggable={false}
            className="z-[2] w-1/3 h-auto"
          ></Image>

          <div className="relative z-[50] w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg text-[#75E8F0] overflow-x-auto whitespace-nowrap">
            <table className="min-w-full divide-y divide-[#FCF551] w-full ">
              <thead className="bg-[#18182a]/80">
                <tr className="">
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Time Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Memory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#18182a]/80 divide-y divide-[#FCF551]/75">
                {problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-[#222251] hover:cursor-pointer transition-colors relative"
                  >
                    {/* <Link href={`/problems/${problem.slug}`} className="absolute cursor-pointer w-full h-full"></Link> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="text-[#75E8F0] hover:underline [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {problem.timeLimit}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {problem.memoryLimit}MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      {problem._count.submissions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-medium">
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="text-[#75E8F0] hover:underline [text-shadow:_0_0_20px_rgba(0,255,255,1)] font-semibold text-base"
                      >
                        View
                      </Link>
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
