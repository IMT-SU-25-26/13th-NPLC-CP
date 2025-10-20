"use client";

import { useState } from "react";

interface SubmitCodeProps {
  problemId: string;
  problemTitle: string;
}

interface TestResult {
  passed: boolean;
  time?: number;
  memory?: number;
  status: string;
}

interface SubmissionResult {
  submissionId: string;
  status: string;
  passed: boolean;
  testResults: TestResult[];
  time?: number;
  memory?: number;
}

const LANGUAGES = [
  { id: "cpp", name: "C++" },
  // { id: "c", name: "C" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  // { id: "javascript", name: "JavaScript" },
];

export default function CodeEditor({
  problemId,
  problemTitle,
}: SubmitCodeProps) {
  const [sourceCode, setSourceCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!sourceCode.trim()) {
      setError("Please write some code first!");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId,
          sourceCode,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "ACCEPTED") return "text-green-600";
    if (status.includes("ERROR")) return "text-red-600";
    if (status === "WRONG_ANSWER") return "text-orange-600";
    if (status === "TIME_LIMIT_EXCEEDED") return "text-yellow-600";
    return "text-gray-600";
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full space-y-4">
      <div className="p-6 w-full h-full bg-black/15 backdrop-blur-2xl border-[#FCF551] border-3 shadow-white/15 shadow-2xl drop-shadow-2xl glow">
        <h2 className="text-2xl font-bold mb-4 text-white">{problemTitle}</h2>

        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 cursor-target w-full  bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap"
            disabled={isSubmitting}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Code Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Your Code
          </label>
          <div className="relative bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap">
            <div className="flex">
              {/* Line Numbers */}
              <div className="flex-shrink-0 p-3 bg-[#18182a]/80 border-r-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap">
                {sourceCode.split("\n").map((_, index) => (
                  <div
                    key={index}
                    className="leading-5 text-right pr-2 min-w-[30px]"
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              {/* Code Editor */}
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="flex-1 h-96 px-3 py-2 font-mono text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] bg-transparent border-0 resize-none focus:outline-none leading-5"
                placeholder="Write your code here..."
                disabled={isSubmitting}
                style={{ lineHeight: "1.25rem" }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#d92fa3] text-white py-3 px-6 rounded-md hover:bg-[#752088] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Code"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            <div
              className={`p-4 rounded-md ${
                result.passed
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  result.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.passed
                  ? "✅ All Test Cases Passed!"
                  : "❌ Some Test Cases Failed"}
              </h3>
              <p className={getStatusColor(result.status)}>
                Status: {formatStatus(result.status)}
              </p>
              {result.time !== undefined && (
                <p className="text-gray-800 font-medium">
                  Time: {result.time.toFixed(3)}s
                </p>
              )}
              {result.memory !== undefined && (
                <p className="text-gray-800 font-medium">
                  Memory: {(result.memory / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            {/* Test Results */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-lg">
                Test Cases:
              </h4>
              {result.testResults.map((test, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${
                    test.passed
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {test.passed ? "✅" : "❌"} Test Case {index + 1}
                    </span>
                    <span className={getStatusColor(test.status)}>
                      {formatStatus(test.status)}
                    </span>
                  </div>
                  {test.time !== undefined && (
                    <p className="text-sm text-gray-800">
                      Time: {test.time.toFixed(3)}s | Memory:{" "}
                      {test.memory ? (test.memory / 1024).toFixed(2) : "N/A"} MB
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
              Submission ID:{" "}
              <span className="font-mono font-semibold">
                {result.submissionId}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
