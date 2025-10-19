import AdminDashboard from "@/components/AdminDashboard";
import ContestTimer from "@/components/ContestTimer";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Contest } from "@prisma/client";

async function getActiveContest(): Promise<Contest> {
  let contest = await prisma.contest.findFirst();

  if (!contest) {
    console.log("No contest found, creating a default one.");
    contest = await prisma.contest.create({
      data: {
        name: "NPLC 13",
        startTime: new Date(),
        endTime: new Date(),
      },
    });
  }

  return contest;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const initialContestState = await getActiveContest();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">Admin Dashboard</h1>
      <p className="text-center text-gray-400 mb-8">Contest Management</p>

      <ContestTimer />
      <AdminDashboard initialContestState={initialContestState} />
    </div>
  );
}
