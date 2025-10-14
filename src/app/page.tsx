import Link from "next/link";
import prisma from "@/lib/prisma";
import AuthButtons from "@/components/AuthButtons";

export default async function Home() {
  const problemCount = await prisma.problem.count();
  const submissionCount = await prisma.submission.count();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Auth buttons in top right */}
        <AuthButtons />

        <div className="text-center mb-16 mt-8 flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            13th NPLC Competitive Programming
          </h1>
          <p className="text-xl text-white mb-8">
            Practice, compete, and improve your coding skills
          </p>
          <Link
            href="/problems"
            className="multiple-regis-button group flex 
              w-[60%] sm:w-[20%] lg:w-[25%] sm:mt-[-1rem] md:mt-[0rem] lg:mt-[0rem]"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 417 138"
              className="cursor-target"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 117.09H41.3058L0 96.9246V117.09Z"
                fill="#661109"
                className={`${"group-hover:fill-[#000000]"} transition-colors duration-200`}
              />
              <path
                d="M98.49 0L0 38.8754V85.6927L64.3021 117.09H309.815L408.305 78.2145V0H98.49Z"
                fill="#661109"
                className={`${"group-hover:fill-[#000000] "} transition-colors duration-200`}
              />
              <path
                d="M8.69482 126.217H50.0006L8.69482 106.044V126.217Z"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc]"} transition-colors duration-200`}
              />
              <path
                d="M107.177 9.12653L8.69482 47.9947V94.8193L72.9969 126.216H318.51L417 87.341V9.12653H107.177Z"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc] "} transition-colors duration-200`}
              />
              <path
                d="M72.6392 132.396H271.941V137.262H72.6392"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc] "} transition-colors duration-200`}
              />
              <path
                d="M8.56348 132.396H49.8693V137.262H8.56348"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc] "} transition-colors duration-200`}
              />
              <text
                x="200"
                y="75"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="18"
                fontWeight="500"
                className="text-[#D787DF] text-5xl sm:text-5xl md:text-5xl lg:text-5xl font-rubik-glitch group-hover:text-[#D787DF]"
              >
                Solve Problem
              </text>
              <text
                x="210"
                y="70"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="18"
                fontWeight="500"
                className="text-[#75E7F0] text-5xl sm:text-5xl md:text-5xl lg:text-5xl font-rubik-glitch group-hover:text-[#75E7F0]"
              >
                Solve Problem
              </text>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="relative z-[10] backdrop-blur-2xl flex w-full flex-col items-center justify-center gap-4 lg:gap-6 p-6 lg:p-12 rounded-xl shadow-lg border-[8px] border-[#FCE551]">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {problemCount}
            </div>
            <div className="text-white">Problems Available</div>
          </div>
          <div className="relative z-[10] backdrop-blur-2xl flex w-full flex-col items-center justify-center gap-4 lg:gap-6 p-6 lg:p-12 rounded-xl shadow-lg border-[8px] border-[#FCE551]">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {submissionCount}
            </div>
            <div className="text-white">Total Submissions</div>
          </div>
          <div className="relative z-[10] backdrop-blur-2xl flex w-full flex-col items-center justify-center gap-4 lg:gap-6 p-6 lg:p-12 rounded-xl shadow-lg border-[8px] border-[#FCE551]">
            <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
            <div className="text-white">Supported Languages</div>
          </div>
        </div>

        <div className="relative z-[10] backdrop-blur-2xl flex flex-col items-center justify-center gap-4 lg:gap-6 p-6 lg:p-12 rounded-xl shadow-lg border-[8px] border-[#FCE551] w-full ">
          <h2 className="text-3xl font-bold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💻</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Online Code Editor
                </h3>
                <p className="text-white">
                  Write and submit code directly in your browser with syntax
                  highlighting
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Real-time Judging
                </h3>
                <p className="text-white">
                  Get instant feedback on your submissions with Judge0
                  integration
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Multiple Languages
                </h3>
                <p className="text-white">
                  Support for C++, C, Python, Java, and JavaScript
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Test Cases</h3>
                <p className="text-white">
                  Sample and hidden test cases to validate your solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/problems"
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
          >
            View All Problems →
          </Link>
        </div>
      </div>
    </div>
  );
}
