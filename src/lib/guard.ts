import prisma from "./prisma";
import { getAuthSession } from "./session";
import { redirect } from "next/navigation";
import { ContestStatus, Role } from "@prisma/client";

export async function checkContest() {
  const session = await getAuthSession();

  if (session?.user?.role === Role.ADMIN) {
    return;
  }

  const contest = await prisma.contest.findFirst();

  if (contest && (contest.status === ContestStatus.PENDING || contest.status === ContestStatus.FINISHED)) {
    redirect("/waiting");
  }
}
