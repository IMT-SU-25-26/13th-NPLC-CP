"use client";

import useSWR from "swr";
import { pusherClient } from "@/lib/pusher";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
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

    if (!contestStatus) {
      return;
    }

    const shouldRedirectToWaiting =
      contestStatus.status === ContestStatus.PENDING ||
      contestStatus.status === ContestStatus.FINISHED ||
      contestStatus.status === ContestStatus.PAUSED;

    if (shouldRedirectToWaiting && pathname !== "/waiting") {
      router.push("/waiting");
    }
  }, [contestStatus, session, router, pathname]);

  return { contestStatus };
}
