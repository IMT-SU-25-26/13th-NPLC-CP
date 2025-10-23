"use client";

import useSWR from "swr";
import { pusherClient } from "@/lib/pusher";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ContestStatus, Role } from "@prisma/client";

interface ContestStatusData {
  status: ContestStatus;
  startTime: string;
  endTime: string;
  serverTime: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useContestGuard() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: contestStatus, mutate } = useSWR<ContestStatusData>(
    "/api/contest/status",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    const channel = pusherClient.subscribe("contest-channel");

    channel.bind("status-update", (data: ContestStatusData) => {
      mutate({
        status: data.status,
        startTime: data.startTime,
        endTime: data.endTime,
        serverTime: new Date().toISOString(),
      });
    });

    return () => {
      pusherClient.unsubscribe("contest-channel");
    };
  }, [mutate]);

  useEffect(() => {
    if (session?.user?.role === Role.ADMIN) {
      return;
    }

    if (
      contestStatus &&
      (contestStatus.status === ContestStatus.PENDING ||
        contestStatus.status === ContestStatus.FINISHED ||
        contestStatus.status === ContestStatus.PAUSED)
    ) {
      router.push("/waiting");
    }
  }, [contestStatus, session, router]);

  return { contestStatus };
}
