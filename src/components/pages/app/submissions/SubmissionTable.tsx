"use client";

import Image from "next/image";
import { FullSubmission } from "@/types/db";
import { getStatusColor } from "@/lib/utils/status";
import { formatStatus } from "@/lib/utils/status";
import { getLanguageName } from "@/lib/utils/language";
import React, { useState } from "react";

interface SubmissionTableProps {
  submissions: FullSubmission[];
}

export default function SubmissionTable({ submissions }: SubmissionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
            {submissions.length === 0 ? (
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#FCF551]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#FCF551]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
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
                      {submission.time
                        ? `${submission.time.toFixed(2)}s`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {submission.memory
                        ? `${Math.round(submission.memory / 1024)}MB`
                        : "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-center ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {formatStatus(submission.status)}
                    </td>
                  </tr>
                  {expandedId === submission.id && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 transition-all duration-300"
                      >
                        <div className="bg-[#0a0a1a]/80 rounded p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-white">
                              Language: {getLanguageName(submission.languageId)}
                            </span>
                            <button
                              className="text-sm bg-[#FCF551] text-[#18182a] px-3 py-1 rounded hover:bg-[#FCF551]/80 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  submission.sourceCode
                                );
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
