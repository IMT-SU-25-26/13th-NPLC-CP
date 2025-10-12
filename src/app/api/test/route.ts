import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        testCases: true,
      },
    });

    const languages = await prisma.language.findMany();

    return NextResponse.json({
      message: "API is working!",
      stats: {
        problems: problems.length,
        languages: languages.length,
        testCases: problems.reduce((sum, p) => sum + p.testCases.length, 0),
      },
      judge0Config: {
        apiUrl: process.env.JUDGE0_API_URL,
        configured: !!process.env.JUDGE0_API_KEY,
      },
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
