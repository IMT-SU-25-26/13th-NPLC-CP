"use client";

import { useContestGuard } from "@/lib/hooks/guard";

export function ContestGuard() {
  useContestGuard();

  return null;
}