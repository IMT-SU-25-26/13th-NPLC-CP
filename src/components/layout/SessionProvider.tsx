"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

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

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus={true}>
      <SessionWatcher>{children}</SessionWatcher>
    </SessionProvider>
  );
}
