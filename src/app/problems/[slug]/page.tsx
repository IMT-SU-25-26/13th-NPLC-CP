import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CodeEditor from "@/components/CodeEditor";
import Image from "next/image";

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
   <div className="relative min-h-screen bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-start items-center overflow-hidden">
      <div className="h-[7vh]"></div>
      <div className="z-[3] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px]"></div>
      <Image src={"/backgrounds/BangunanDepanUngu.svg"} alt="purple" width={100} height={100} className="z-[2] w-full h-auto absolute bottom-[0]"></Image>
      <Image src={"/backgrounds/BangunanBelakangBiru.svg"} alt="purple" width={100} height={100} className=" z-[1] w-full h-auto absolute bottom-[0]"></Image>
      <Image src={"/backgrounds/Stairs.svg"} alt="purple" width={100} height={100} className="z-[4] w-full h-auto absolute bottom-[-2.5%]"></Image>
      <div className="relative mt-[5%] z-[10] w-full flex flex-col justify-start items-start">
        <div className="max-w-[77%] mx-auto p-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-start">
            {/* Problem Description */}
            <div className=" rounded-lg p-6 backdrop-blur-2xl border-[#FCF551] border-3 shadow-white/15 shadow-2xl drop-shadow-2xl glow">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4 text-white">
                  {problem.title}
                </h1>
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
                <div className="whitespace-pre-wrap text-white leading-relaxed">
                  {problem.description}
                </div>
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
                          <pre className="p-4 rounded border border-[#FCF551] text-sm overflow-x-auto text-[#75E8F0]">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white mb-2">
                            Expected Output:
                          </p>
                          <pre className="p-4 rounded border border-[#FCF551] text-sm overflow-x-auto text-[#75E8F0]">
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
    </div>
  );
}
