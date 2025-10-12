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
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Problems</h1>
          <p className="text-gray-700 text-lg">
            Practice your coding skills with {problems.length} problems
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
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
            <tbody className="bg-white divide-y divide-gray-200">
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
  );
}
