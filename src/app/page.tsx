import Link from "next/link";
import prisma from "@/lib/prisma";
import AuthButtons from "@/components/AuthButtons";

export default async function Home() {
  const problemCount = await prisma.problem.count();
  const submissionCount = await prisma.submission.count();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Auth buttons in top right */}
        <AuthButtons />

        <div className="text-center mb-16 mt-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            13th NPLC Competitive Programming
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice, compete, and improve your coding skills
          </p>
          <Link
            href="/problems"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start Solving Problems →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {problemCount}
            </div>
            <div className="text-gray-600">Problems Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {submissionCount}
            </div>
            <div className="text-gray-600">Total Submissions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
            <div className="text-gray-600">Supported Languages</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-2xl">💻</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Online Code Editor
                </h3>
                <p className="text-gray-600">
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
                <p className="text-gray-600">
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
                <p className="text-gray-600">
                  Support for C++, C, Python, Java, and JavaScript
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Test Cases</h3>
                <p className="text-gray-600">
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
