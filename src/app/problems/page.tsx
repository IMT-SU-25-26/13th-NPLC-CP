import ProblemTable from "@/components/pages/problems/ProblemTable";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProblemsPage() {
  const session = await getServerSession(authOptions);

  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  const solvedProblemIds = session
    ? await prisma.submission
        .findMany({
          where: {
            userId: session.user.id,
            status: "ACCEPTED",
          },
          select: { problemId: true },
        })
        .then((subs) => subs.map((s) => s.problemId))
    : [];

  return (
    <ProblemTable problems={problems} solvedProblemIds={solvedProblemIds} />
  );
}
