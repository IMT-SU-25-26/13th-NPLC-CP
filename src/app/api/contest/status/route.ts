import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getActiveContest() {
  const contest = await prisma.contest.findFirst();
  if (!contest) {
    throw new Error(
      "Contest has not been seeded in the database. Please run 'pnpm prisma db seed'."
    );
  }
  return contest;
}

export async function GET() {
  try {
    const contest = await getActiveContest();

    return NextResponse.json({
      status: contest.status,
      startTime: contest.startTime.toISOString(),
      endTime: contest.endTime.toISOString(),
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch contest status:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch contest status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
