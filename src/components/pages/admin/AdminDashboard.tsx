"use client";

import useSWR from "swr";
import Pusher from "pusher-js";
import { useState, useEffect } from "react";
import { Contest, ContestStatus } from "@prisma/client";
import {
  startContest,
  pauseContest,
  resumeContest,
  freezeContest,
  unfreezeContest,
  endContest,
} from "@/lib/services/contest";

type Action = "start" | "pause" | "resume" | "freeze" | "unfreeze" | "end";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard({
  initialContestState,
}: {
  initialContestState: Contest | null;
}) {
  const { data: contest, mutate } = useSWR<Contest>(
    "/api/contest/status",
    fetcher,
    {
      fallbackData: initialContestState || undefined,
    }
  );

  const [isLoading, setIsLoading] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [durationHours, setDurationHours] = useState(2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
      const channel = pusherClient.subscribe("contest-channel");

      channel.bind("status-update", () => {
        mutate();
      });

      return () => {
        pusherClient.unsubscribe("contest-channel");
      };
    }
  }, [mutate]);

  const handleAction = async (action: Action) => {
    setIsLoading(action);
    setError(null);
    try {
      switch (action) {
        case "start":
          const formData = new FormData();
          formData.append("durationHours", durationHours.toString());
          await startContest(formData);
          break;
        case "pause":
          await pauseContest();
          break;
        case "resume":
          await resumeContest();
          break;
        case "freeze":
          await freezeContest();
          break;
        case "unfreeze":
          await unfreezeContest();
          break;
        case "end":
          await endContest();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  const status = contest?.status || ContestStatus.PENDING;

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
      <div className="mb-6 text-center">
        <p className="text-gray-400">Current Status:</p>
        <p className="text-2xl font-bold text-purple-400">{status}</p>
      </div>

      {(status === ContestStatus.PENDING ||
        status === ContestStatus.FINISHED) && (
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="duration" className="text-white">
            Duration (hours):
          </label>
          <input
            type="number"
            id="duration"
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
            className="bg-gray-700 text-white rounded p-2 w-24"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAction("start")}
          disabled={
            isLoading !== null ||
            (status !== "PENDING" && status !== "FINISHED")
          }
          className="btn-admin bg-green-600 hover:bg-green-700 disabled:bg-gray-500"
        >
          {status === "FINISHED" ? "Restart" : "Start"}
        </button>
        <button
          onClick={() => handleAction("end")}
          disabled={true}
          className="btn-admin bg-red-600 hover:bg-red-700 disabled:bg-gray-500"
        >
          End
        </button>
        <button
          onClick={() => handleAction("pause")}
          disabled={
            isLoading !== null || !(status === "RUNNING" || status === "FROZEN")
          }
          className="btn-admin bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-500"
        >
          Pause
        </button>
        <button
          onClick={() => handleAction("resume")}
          disabled={isLoading !== null || status !== "PAUSED"}
          className="btn-admin bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
        >
          Resume
        </button>
        <button
          onClick={() => handleAction("freeze")}
          disabled={isLoading !== null || status !== "RUNNING"}
          className="btn-admin bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500"
        >
          Freeze
        </button>
        <button
          onClick={() => handleAction("unfreeze")}
          disabled={isLoading !== null || status !== "FROZEN"}
          className="btn-admin bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500"
        >
          Unfreeze
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
