import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  const skip = (page - 1) * limit;

  try {
    const [users, totalUsers] = await prisma.$transaction([
      prisma.user.findMany({
        orderBy: [{ score: "desc" }, { lastSubmission: "asc" }],
        skip: skip,
        take: limit,
        select: {
          id: true,
          name: true,
          score: true,
        },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      data: users,
      meta: {
        totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
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
