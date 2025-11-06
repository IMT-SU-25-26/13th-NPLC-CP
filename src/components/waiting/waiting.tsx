"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { ContestStatus } from "@prisma/client";

interface WaitingProps {
  status?: ContestStatus;
}

export function Waiting({ status = ContestStatus.PENDING }: WaitingProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/contest/status");
        const data = await response.json();
        if (data.status) {
          setCurrentStatus(data.status);
          if (
            data.status === ContestStatus.RUNNING ||
            data.status === ContestStatus.FROZEN
          ) {
            router.push("/problems");
          }
        }
      } catch (error) {
        console.error("Failed to fetch contest status:", error);
      }
    };

    const channel = pusherClient.subscribe("contest-channel");
    console.log("Subscribed to contest-channel");

    // Add connection debugging
    pusherClient.connection.bind('connected', () => {
      console.log('Pusher connected successfully');
    });

    pusherClient.connection.bind('error', (err: any) => {
      console.log('Pusher connection error:', err);
    });

    pusherClient.connection.bind('disconnected', () => {
      console.log('Pusher disconnected');
    });

    channel.bind("status-update", (data: any) => {
      console.log("Raw Pusher data received:", data);
      console.log("Pusher status update received:", data?.status);
      setCurrentStatus(data.status);
      if (
        data.status === ContestStatus.RUNNING ||
        data.status === ContestStatus.FROZEN
      ) {
        console.log("Redirecting to /problems due to status:", data.status);
        router.push("/problems");
        router.refresh();
      }
    });

    fetchStatus();

    return () => {
      console.log("Unsubscribing from contest-channel");
      pusherClient.unsubscribe("contest-channel");
    };
  }, [router]);

  const isPending = currentStatus === ContestStatus.PENDING;
  const isPaused = currentStatus === ContestStatus.PAUSED;
  const isFinished = currentStatus === ContestStatus.FINISHED;

  return (
    <div className="relative z-[100] w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] backdrop-blur-2xl flex flex-col items-center justify-center gap-6 p-8 lg:p-12 rounded-xl shadow-lg border-8 border-[#FCF551]">
      <div className="text-center flex flex-col items-center justify-center gap-4">
        {/* Icon */}
        <div className="text-[#75E8F0] [text-shadow:_0_0_30px_rgba(0,255,255,1)]">
          {isPending ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#75E8F0] [text-shadow:_0_0_30px_rgba(0,255,255,1)] mb-4">
          {isPending
            ? "Contest Has Not Started Yet"
            : isPaused
            ? "Contest Is Paused"
            : isFinished
            ? "Contest Has Ended"
            : "Contest Is Running"}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,0.8)] mb-4 max-w-2xl">
          {isPending
            ? "The competition hasn't begun yet. Please wait for the admin to start the contest."
            : isPaused
            ? "The competition is currently paused. Please wait for the admin to resume the contest."
            : isFinished
            ? "The competition has concluded. Thank you for participating!"
            : "The competition is currently running. Please navigate to the problems page to continue, good luck!"}
        </p>
      </div>
    </div>
  );
}
