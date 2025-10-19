import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/lib/pusher";
import { ContestStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function getActiveContest() {
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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let updatedContest;
  try {
    const body = await request.json();
    const { action, durationHours } = body;
    const contest = await getActiveContest();
    const now = new Date();

    switch (action) {
      case "start":
        if (contest.status !== ContestStatus.PENDING) {
          throw new Error("Contest has already started.");
        }
        const duration = Number(durationHours);
        if (!duration || duration <= 0) {
          throw new Error("Invalid contest duration.");
        }
        updatedContest = await prisma.contest.update({
          where: { id: contest.id },
          data: {
            status: ContestStatus.RUNNING,
            startTime: now,
            endTime: new Date(now.getTime() + duration * 60 * 60 * 1000),
            pausedTime: null,
            totalPausedDuration: 0,
          },
        });
        break;

      case "pause":
        if (
          contest.status === ContestStatus.RUNNING ||
          contest.status === ContestStatus.FROZEN
        ) {
          updatedContest = await prisma.contest.update({
            where: { id: contest.id },
            data: {
              status: ContestStatus.PAUSED,
              statusBeforePause: contest.status,
              pausedTime: now,
            },
          });
        }
        break;

      case "resume":
        if (contest.status === ContestStatus.PAUSED && contest.pausedTime) {
          const pausedDuration = Math.round(
            (now.getTime() - contest.pausedTime.getTime()) / 1000
          );
          updatedContest = await prisma.contest.update({
            where: { id: contest.id },
            data: {
              status: contest.statusBeforePause || ContestStatus.RUNNING,
              statusBeforePause: null,
              pausedTime: null,
              totalPausedDuration: contest.totalPausedDuration + pausedDuration,
              endTime: new Date(
                contest.endTime.getTime() + pausedDuration * 1000
              ),
            },
          });
        }
        break;

      case "freeze":
        if (contest.status === ContestStatus.RUNNING) {
          updatedContest = await prisma.contest.update({
            where: { id: contest.id },
            data: { status: ContestStatus.FROZEN },
          });
        }
        break;

      case "unfreeze":
        if (contest.status === ContestStatus.FROZEN) {
          updatedContest = await prisma.contest.update({
            where: { id: contest.id },
            data: { status: ContestStatus.RUNNING },
          });
        }
        break;

      case "end":
        updatedContest = await prisma.contest.update({
          where: { id: contest.id },
          data: { status: ContestStatus.FINISHED, endTime: now },
        });
        break;

      default:
        throw new Error("Invalid action");
    }

    if (updatedContest) {
      await pusherServer.trigger(
        "contest-channel",
        "status-update",
        updatedContest
      );
      return NextResponse.json(updatedContest);
    } else {
      return NextResponse.json(contest);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
