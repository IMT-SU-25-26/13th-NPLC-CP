import { getDifficultyColor } from "@/lib/utils/difficulty";
import { FullProblem } from "@/types/db";

interface ProblemDetailProps {
  problem: FullProblem;
}

export default function ProblemDetail({ problem }: ProblemDetailProps) {
  return (
    <div className="p-6 bg-black/15 backdrop-blur-2xl border-[#FCF551] border-3 shadow-white/15 shadow-2xl drop-shadow-2xl glow overflow-auto h-[calc(100vh-12rem)] lg:h-[calc(100vh-20rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">{problem.title}</h1>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
          <span className="text-sm text-white font-medium">
            ⏱️ Time Limit: {problem.timeLimit}s
          </span>
          <span className="text-sm text-white font-medium">
            💾 Memory: {problem.memoryLimit}MB
          </span>
        </div>
      </div>

      <div className="prose max-w-none">
        <div
          className="whitespace-pre-wrap text-white leading-relaxed"
          dangerouslySetInnerHTML={{ __html: problem.description }}
        />
      </div>

      {problem.testCases.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Sample Test Cases
          </h3>
          {problem.testCases.map((testCase, index) => (
            <div
              key={testCase.id}
              className="mb-6 p-6 cursor-target w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] overflow-x-auto whitespace-nowrap"
            >
              <p className="font-semibold text-white mb-4">
                Sample {index + 1}:
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white mb-2">
                    Input:
                  </p>
                  <pre className="p-4 rounded border border-[#FCF551] text-sm overflow-x-auto text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)]">
                    {testCase.input}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-2">
                    Expected Output:
                  </p>
                  <pre className="p-4 rounded border border-[#FCF551] text-sm overflow-x-auto text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)]">
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
