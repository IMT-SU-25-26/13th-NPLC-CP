"use server";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { ContestStatus } from "@prisma/client";

export async function getActiveContest() {
  let contest = await prisma.contest.findFirst();
  if (!contest) {
    contest = await prisma.contest.create({
      data: {
        name: "NPLC 13",
        startTime: new Date(),
        endTime: new Date(),
        status: ContestStatus.PENDING,
      },
    });
  }
  return contest;
}

export async function startContest(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const durationHours = formData.get("durationHours") as string;
  const duration = Number(durationHours);

  if (!duration || duration <= 0) {
    throw new Error("Invalid contest duration.");
  }

  const contest = await getActiveContest();
  const now = new Date();

  if (contest.status !== ContestStatus.PENDING) {
    throw new Error("Contest has already started.");
  }

  const updatedContest = await prisma.contest.update({
    where: { id: contest.id },
    data: {
      status: ContestStatus.RUNNING,
      startTime: now,
      endTime: new Date(now.getTime() + duration * 60 * 60 * 1000),
      pausedTime: null,
      totalPausedDuration: 0,
    },
  });

  await pusherServer.trigger(
    "contest-channel",
    "status-update",
    updatedContest
  );

  revalidatePath("/admin");
}

export async function pauseContest() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const contest = await getActiveContest();
  const now = new Date();

  if (
    contest.status !== ContestStatus.RUNNING &&
    contest.status !== ContestStatus.FROZEN
  ) {
    throw new Error("Contest is not running or frozen.");
  }

  const updatedContest = await prisma.contest.update({
    where: { id: contest.id },
    data: {
      status: ContestStatus.PAUSED,
      statusBeforePause: contest.status,
      pausedTime: now,
    },
  });

  await pusherServer.trigger(
    "contest-channel",
    "status-update",
    updatedContest
  );

  revalidatePath("/admin");
}

export async function resumeContest() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const contest = await getActiveContest();
  const now = new Date();

  if (contest.status !== ContestStatus.PAUSED || !contest.pausedTime) {
    throw new Error("Contest is not paused.");
  }

  const pausedDuration = Math.round(
    (now.getTime() - contest.pausedTime.getTime()) / 1000
  );

  const updatedContest = await prisma.contest.update({
    where: { id: contest.id },
    data: {
      status: contest.statusBeforePause || ContestStatus.RUNNING,
      statusBeforePause: null,
      pausedTime: null,
      totalPausedDuration: contest.totalPausedDuration + pausedDuration,
      endTime: new Date(contest.endTime.getTime() + pausedDuration * 1000),
    },
  });

  await pusherServer.trigger(
    "contest-channel",
    "status-update",
    updatedContest
  );

  revalidatePath("/admin");
}

export async function freezeContest() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const contest = await getActiveContest();

  if (contest.status !== ContestStatus.RUNNING) {
    throw new Error("Contest is not running.");
  }

  const updatedContest = await prisma.contest.update({
    where: { id: contest.id },
    data: { status: ContestStatus.FROZEN },
  });

  await pusherServer.trigger(
    "contest-channel",
    "status-update",
    updatedContest
  );

  revalidatePath("/admin");
}

export async function unfreezeContest() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const contest = await getActiveContest();

  if (contest.status !== ContestStatus.FROZEN) {
    throw new Error("Contest is not frozen.");
  }

  const updatedContest = await prisma.contest.update({
    where: { id: contest.id },
    data: { status: ContestStatus.RUNNING },
  });

  await pusherServer.trigger(
    "contest-channel",
    "status-update",
    updatedContest
  );

  revalidatePath("/admin");
}

export async function endContest() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  const contest = await getActiveContest();

  if (
    contest.status === ContestStatus.PENDING ||
    contest.status === ContestStatus.FINISHED
  ) {
    throw new Error("Contest cannot be ended in its current state.");
  }
  const updatedContest = await prisma.contest.update({
    where: { id: contest.id },
    data: { status: ContestStatus.FINISHED, endTime: new Date() },
  });
  await pusherServer.trigger(
    "contest-channel",
    "status-update",
    updatedContest
  );
  revalidatePath("/admin");
}

export async function getContestStatus() {
  const contest = await getActiveContest();

  return {
    status: contest.status,
    startTime: contest.startTime.toISOString(),
    endTime: contest.endTime.toISOString(),
    serverTime: new Date().toISOString(),
  };
}
