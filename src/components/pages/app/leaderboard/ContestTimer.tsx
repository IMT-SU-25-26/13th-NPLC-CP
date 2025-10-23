"use client";

import Pusher from "pusher-js";
import useSWR, { useSWRConfig } from "swr";
import { useState, useEffect } from "react";
import { ContestStatus } from "@prisma/client";

interface ContestState {
  status: ContestStatus;
  startTime: string;
  endTime: string;
  serverTime: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TimerBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-bold tracking-widest">{value}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

export default function ContestTimer() {
  const { data, error } = useSWR<ContestState>("/api/contest/status", fetcher);
  const { mutate } = useSWRConfig();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusherClient.subscribe("contest-channel");
    channel.bind("status-update", (updatedContest: ContestState) => {
      mutate("/api/contest/status", updatedContest, false);
    });

    return () => {
      pusherClient.unsubscribe("contest-channel");
    };
  }, [mutate]);

  useEffect(() => {
    if (!data || !data.endTime || !data.serverTime) {
      return;
    }

    const serverTime = new Date(data.serverTime).getTime();
    if (isNaN(serverTime)) {
      return;
    }

    const clientTime = Date.now();
    const timeOffset = serverTime - clientTime;

    const interval = setInterval(() => {
      if (data.status === "RUNNING" || data.status === "FROZEN") {
        const endTime = new Date(data.endTime).getTime();

        if (isNaN(endTime)) {
          setTimeLeft(0);
          return;
        }

        const now = new Date(Date.now() + timeOffset);
        const remaining = Math.round((endTime - now.getTime()) / 1000);
        setTimeLeft(Math.max(0, remaining));
      } else if (data.status === "PAUSED") {
        // When paused, do not update the timer.
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const h = Math.floor(timeLeft / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, "0");

  const getStatusMessage = () => {
    if (error) return "Error";
    if (!data) return "Loading...";
    switch (data.status) {
      case "PENDING":
        return "Contest Not Started";
      case "PAUSED":
        return "Contest Paused";
      case "FINISHED":
        return "Contest Finished";
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/80 backdrop-blur-sm text-white font-mono py-4 px-6 rounded-lg shadow-lg border border-purple-500/50 flex justify-center items-center mb-8">
      {statusMessage ? (
        <span className="text-xl font-bold">{statusMessage}</span>
      ) : (
        <div className="flex items-center gap-3">
          <TimerBox value={h} label="HRS" />
          <span>:</span>
          <TimerBox value={m} label="MIN" />
          <span>:</span>
          <TimerBox value={s} label="SEC" />
        </div>
      )}
    </div>
  );
}
