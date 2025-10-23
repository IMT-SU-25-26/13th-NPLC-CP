"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

// Define the submission type based on what we expect from the API
interface Submission {
  id: string;
  createdAt: string;
  status: string;
  time?: number | null;
  memory?: number | null;
  sourceCode: string;
  languageId: number;
}

export default function SubmissionHistoryPage() {

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Dummy data for submissions
  const dummySubmissions: Submission[] = [
    {
      id: "1",
      createdAt: new Date().toISOString(),
      status: "ACCEPTED",
      time: 1.23,
      memory: 2048,
      sourceCode: "print('Hello, World!')",
      languageId: 71,
    },
    {
      id: "2",
      createdAt: new Date().toISOString(),
      status: "WRONG_ANSWER",
      time: 2.34,
      memory: 1024,
      sourceCode: "console.log('Wrong Answer');",
      languageId: 54,
    },
    {
      id: "3",
      createdAt: new Date().toISOString(),
      status: "TIME_LIMIT_EXCEEDED",
      time: null,
      memory: null,
      sourceCode: "while(true) {}",
      languageId: 62,
    },
  ];

  // Use dummy data instead of fetching from API
  useEffect(() => {
    setTimeout(() => {
      setSubmissions(dummySubmissions);
      setLoading(false);
    }, 1000); // Simulate loading delay
  }, []);

  // Toggle expanded state for a submission
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Get status color based on submission status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "text-green-500";
      case "WRONG_ANSWER":
        return "text-red-500";
      case "TIME_LIMIT_EXCEEDED":
        return "text-yellow-500";
      case "COMPILATION_ERROR":
        return "text-orange-500";
      default:
        return "";
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  // Map language ID to a language name
  const getLanguageName = (languageId: number) => {
    const languageMap: Record<number, string> = {
      54: "C++ (GCC 9.2.0)",
      71: "Python (3.8.1)",
      62: "Java (OpenJDK 13.0.1)",
    };
    return languageMap[languageId] || `Language ID: ${languageId}`;
  };

  return (
    <>
      <Image
        src={"/logos/HistoryText.svg"}
        alt="historytext"
        width={100}
        height={100}
        draggable={false}
        className="z-[2] w-1/4 h-auto mb-6"
      />

      <div className="relative z-[50] w-full text-md md:text-2xl bg-[#18182a]/80 border-2 border-[#FCF551] rounded-lg text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto">
        <table className="min-w-full divide-y divide-[#FCF551] w-full">
          <thead className="bg-[#18182a]/80">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Submission Time
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Runtime
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Memory
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#18182a]/80 divide-y divide-[#FCF551]/75">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  Loading submissions...
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((submission, index) => (
                <React.Fragment key={submission.id}>
                  <tr
                    className="hover:bg-[#222251] cursor-pointer transition-colors relative"
                    onClick={() => toggleExpand(submission.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="inline-block">
                          {expandedId === submission.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FCF551]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FCF551]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </span>
                        <span>{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {new Date(submission.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {submission.time ? `${submission.time.toFixed(2)}s` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {submission.memory ? `${Math.round(submission.memory / 1024)}MB` : "N/A"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-center ${getStatusColor(submission.status)}`}>
                      {formatStatus(submission.status)}
                    </td>
                  </tr>
                  {expandedId === submission.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 transition-all duration-300">
                        <div className="bg-[#0a0a1a]/80 rounded p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-white">
                              Language: {getLanguageName(submission.languageId)}
                            </span>
                            <button
                              className="text-sm bg-[#FCF551] text-[#18182a] px-3 py-1 rounded hover:bg-[#FCF551]/80 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(submission.sourceCode);
                              }}
                            >
                              Copy Code
                            </button>
                          </div>
                          <pre className="text-sm bg-[#111122] p-4 rounded overflow-x-auto">
                            <code>{submission.sourceCode}</code>
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
