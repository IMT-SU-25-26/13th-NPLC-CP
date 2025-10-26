"use client";

import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";

function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;
    }

    if (
      status === "unauthenticated" &&
      wasAuthenticated.current &&
      window.location.pathname !== "/auth/login"
    ) {
      toast.error("Session invalidated - logged in from another device");
      wasAuthenticated.current = false;
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [status]);

  return <>{children}</>;
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus={true}>
      <SessionWatcher>{children}</SessionWatcher>
    </SessionProvider>
  );
}
