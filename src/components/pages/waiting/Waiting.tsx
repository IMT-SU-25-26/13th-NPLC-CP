import { ContestStatus } from "@prisma/client";

interface WaitingProps {
  status?: ContestStatus;
}

export default function Waiting({
  status = ContestStatus.PENDING,
}: WaitingProps) {
  const isPending = status === ContestStatus.PENDING;
  const isPaused = status === ContestStatus.PAUSED;
  const isRunning = status === ContestStatus.RUNNING;

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
            : isRunning
            ? "Contest Is Running"
            : "Contest Has Ended"}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,0.8)] mb-4 max-w-2xl">
          {isPending
            ? "The competition hasn't begun yet. Please wait for the admin to start the contest."
            : isPaused
            ? "The competition is currently paused. Please wait for the admin to resume the contest."
            : isRunning
            ? "The competition is currently running. Please navigate to the problems page to continue, good luck!"
            : "The competition has concluded. Thank you for participating!"}
        </p>
      </div>
    </div>
  );
}
