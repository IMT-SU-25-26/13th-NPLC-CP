import ProblemTable from "@/components/pages/problems/ProblemTable";
import prisma from "@/lib/prisma";

export default async function ProblemsPage() {
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

  return <ProblemTable problems={problems} />;
}
