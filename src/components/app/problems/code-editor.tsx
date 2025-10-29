"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { TestResult } from "@/types/submission";
import { submitCode } from "@/services/submission";

interface SubmitCodeProps {
  problemId: string;
  attemptedCode?: string;
}

const LANGUAGES = [
  { id: "cpp", name: "C++" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
];

export function CodeEditor({ problemId, attemptedCode }: SubmitCodeProps) {
  const [sourceCode, setSourceCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (attemptedCode) {
      setSourceCode(attemptedCode);
    }
  }, [attemptedCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;

    e.preventDefault();
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = sourceCode;
    const tab = "\t";

    if (start === end) {
      // Insert single tab at caret
      const newValue = value.slice(0, start) + tab + value.slice(end);
      setSourceCode(newValue);
      // update cursor after state update
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            start + tab.length;
        }
      });
    } else {
      // Indent / Unindent selected lines
      const selected = value.slice(start, end);
      const lines = selected.split("\n");

      if (!e.shiftKey) {
        // Indent: add tab to each line
        const indented = lines.map((l) => tab + l).join("\n");
        const newValue = value.slice(0, start) + indented + value.slice(end);
        setSourceCode(newValue);

        const addedLength = indented.length - selected.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start;
            textareaRef.current.selectionEnd = end + addedLength;
          }
        });
      } else {
        // Unindent: remove leading tab or up to 4 spaces
        const unindentedLines = lines.map((l) => {
          if (l.startsWith(tab)) return l.slice(tab.length);
          return l.replace(/^ {1,4}/, "");
        });
        const unindented = unindentedLines.join("\n");
        const newValue = value.slice(0, start) + unindented + value.slice(end);
        setSourceCode(newValue);

        const removedLength = selected.length - unindented.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start;
            textareaRef.current.selectionEnd = end - removedLength;
          }
        });
      }
    }

    // keep line numbers scroll synced (existing behavior handles scroll)
  };

  const handleSubmit = async () => {
    if (!sourceCode.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await submitCode({
        problemId,
        sourceCode,
        language,
      });

      if (!data.success) {
        throw new Error(data.error || "Submission failed");
      }

      if (data.passed) {
        toast.success("All Test Cases Passed!", {
          description: `Status: ${data.status}`,
        });
      } else {
        const failedTests =
          data.testResults
            ?.map((test: TestResult, index: number) =>
              !test.passed ? `Test Case ${index + 1}: ${test.status}` : null
            )
            .filter(Boolean) || [];

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
              onKeyDown={handleKeyDown}
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
