import prisma from "@/lib/core/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ContestStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  const skip = (page - 1) * limit;

  try {
    const contest = await prisma.contest.findFirst();
    
    if (contest?.status === ContestStatus.FROZEN && contest.frozenLeaderboard) {
      const frozenData = contest.frozenLeaderboard as Array<{
        id: string;
        name: string | null;
        score: number;
      }>;
      
      const paginatedData = frozenData.slice(skip, skip + limit);
      const totalUsers = frozenData.length;
      
      return NextResponse.json({
        data: paginatedData,
        meta: {
          totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
          isFrozen: true,
        },
      });
    }

    const [users, totalUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          role: "USER",
        },
        orderBy: [{ score: "desc" }, { lastSubmission: "asc" }],
        skip: skip,
        take: limit,
        select: {
          id: true,
          name: true,
          score: true,
        },
      }),
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),
    ]);

    return NextResponse.json({
      data: users,
      meta: {
        totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
        isFrozen: false,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
