import Image from "next/image";
import Link from "next/link";
import { getDifficultyBorderColor } from "@/utils/difficulty";
import { Problem } from "@/types/db";

interface ProblemsPageProps {
  problems: Problem[];
}

export default function ProblemTable({ problems }: ProblemsPageProps) {
  return (
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

        <div className="relative z-[50] w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap">
          <table className="min-w-full divide-y divide-[#FCF551] w-full ">
            <thead className="bg-[#18182a]/80">
              <tr className="">
                <th className="px-6 py-3 text-left text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                  Problem
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
              </tr>
            </thead>
            <tbody className="bg-[#18182a]/80 divide-y divide-[#FCF551]/75">
              {problems.map((problem) => (
                <tr
                  key={problem.id}
                  className="hover:bg-[#222251] hover:cursor-pointer transition-colors relative"
                >
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
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyBorderColor(
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
