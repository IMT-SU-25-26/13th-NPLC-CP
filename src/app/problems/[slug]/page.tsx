import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CodeEditor from "@/components/CodeEditor";
import NavigationBar from "@/components/NavigationBar";

interface ProblemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;

  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: {
      testCases: {
        where: { isSample: true },
      },
    },
  });

  if (!problem) {
    notFound();
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit border border-gray-200">
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">{problem.title}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  ⏱️ Time Limit: {problem.timeLimit}s
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  💾 Memory: {problem.memoryLimit}MB
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{problem.description}</div>
            </div>

            {problem.testCases.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Sample Test Cases</h3>
                {problem.testCases.map((testCase, index) => (
                  <div key={testCase.id} className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-2">
                      Sample {index + 1}:
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">Input:</p>
                        <pre className="bg-white p-2 rounded border border-gray-300 text-sm overflow-x-auto text-gray-900">
                          {testCase.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Expected Output:
                        </p>
                        <pre className="bg-white p-2 rounded border border-gray-300 text-sm overflow-x-auto text-gray-900">
                          {testCase.expectedOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="lg:sticky lg:top-8 h-fit">
            <CodeEditor problemId={problem.id} problemTitle={problem.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
