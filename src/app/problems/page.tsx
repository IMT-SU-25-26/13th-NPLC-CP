import Link from "next/link";
import prisma from "@/lib/prisma";
import NavigationBar from "@/components/NavigationBar";

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
        return "text-green-600 bg-green-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "HARD":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-start items-center overflow-hidden">
      <div className="z-[1] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-[1100px] h-[900px] rounded-full blur-[100px]"></div>
      <div className="z-[3] w-full justify-start items-center flex flex-col">
        <div className="max-w-[75%] w-full mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Problems</h1>
            <p className="text-gray-200 text-lg">
              Practice your coding skills with {problems.length} problems
            </p>
          </div>

          <div className="bg-white/75 rounded-lg shadow-md overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 /75">
              <thead className="bg-gray-100 /75">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Time Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Memory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Submissions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/75 divide-y divide-gray-200/75">
                {problems.map((problem) => (
                  <tr
                    key={problem.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/problems/${problem.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-base"
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {problem.timeLimit}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {problem.memoryLimit}MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {problem._count.submissions}
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
