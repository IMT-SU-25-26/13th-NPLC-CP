"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { SubmissionResponse, TestResult } from "@/types/submission";

interface SubmitCodeProps {
  problemId: string;
  attemptedCode?: string;
}

const LANGUAGES = [
  { id: "cpp", name: "C++" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
];

export default function CodeEditor({ problemId, attemptedCode }: SubmitCodeProps) {
  const [sourceCode, setSourceCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fill in attempted code if available
  useEffect(() => {
    if (attemptedCode) {
      setSourceCode(attemptedCode);
    }
  }, [attemptedCode]);

  const handleSubmit = async () => {
    if (!sourceCode.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    setIsSubmitting(true);

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

      const contentType = response.headers.get("content-type") || "";
      let data: SubmissionResponse;

      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch {
          const text = await response.text();
          throw new Error(
            `Invalid JSON response from server. Response preview: ${text.slice(
              0,
              1000
            )}`
          );
        }
      } else {
        const text = await response.text();
        throw new Error(
          `Server returned non-JSON response (content-type: ${contentType}). Preview: ${text
            .replace(/\s+/g, " ")
            .slice(0, 1000)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || `Submission failed (${response.status})`
        );
      }

      if (data.passed) {
        toast.success("All Test Cases Passed!", {
          description: `Status: ${data.status}`,
        });
      } else {
        const failedTests = data.testResults
          .map((test: TestResult, index: number) =>
            !test.passed ? `Test Case ${index + 1}: ${test.status}` : null
          )
          .filter(Boolean);

        const failedDescription = failedTests.slice(0, 3).join("\n");
        const moreTests =
          failedTests.length > 3
            ? `\n...and ${failedTests.length - 3} more`
            : "";

        toast.error("Some Test Cases Failed", {
          description: `${failedDescription}${moreTests}`,
          duration: 6000,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error("Submission Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-6 bg-black/15 backdrop-blur-2xl border-[#FCF551] border-3 shadow-white/15 shadow-2xl drop-shadow-2xl glow overflow-auto h-[calc(100vh-12rem)] lg:h-[calc(100vh-20rem)] flex flex-col">
      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-xl font-medium text-white mb-2">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-3 cursor-target w-full bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap"
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
        <label className="block text-xl font-medium text-white mb-2">
          Your Code
        </label>
        <div className="relative bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-hidden h-[400px]">
          <div className="flex h-full">
            <div
              ref={lineNumbersRef}
              tabIndex={-1}
              onWheel={(e) => {
                e.preventDefault();
                if (textareaRef.current) {
                  textareaRef.current.scrollTop += e.deltaY;
                }
              }}
              className="flex-shrink-0 p-0 pt-2 bg-[#18182a]/80 border-r-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-hidden select-none h-full font-mono text-sm"
              style={{ lineHeight: "1.5rem" }}
            >
              <div className="px-3">
                {Array.from(
                  { length: Math.max(sourceCode.split("\n").length, 1) },
                  (_, i) => (
                    <div
                      key={i}
                      className="h-[1.5rem] text-right pr-2 min-w-[30px]"
                    >
                      {i + 1}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Code Editor */}
            <textarea
              ref={textareaRef}
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              onScroll={(e) => {
                if (lineNumbersRef.current) {
                  lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
                }
              }}
              wrap="off"
              className="flex-1 h-full pt-2 px-3 py-2 font-mono text-sm text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] bg-transparent border-0 overflow-auto whitespace-pre text-left resize-none focus:outline-none"
              placeholder="Write your code here..."
              disabled={isSubmitting}
              style={{ lineHeight: "1.5rem" }}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-[#d92fa3] text-white py-3 px-6 rounded-md cursor-pointer hover:bg-[#752088] disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Code"}
      </button>
    </div>
  );
}
