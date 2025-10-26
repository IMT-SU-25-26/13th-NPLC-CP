import prisma from "@/lib/prisma";
import ProblemTable from "@/components/pages/app/problems/ProblemTable";
import { getAuthSession } from "@/lib/session";
import { ContestGuard } from "@/components/layout/ContestGuard";

export default async function ProblemsPage() {
  const session = await getAuthSession();

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
    <>
      <ContestGuard />
      <ProblemTable problems={problems} solvedProblemIds={solvedProblemIds} />
    </>
  );
}
