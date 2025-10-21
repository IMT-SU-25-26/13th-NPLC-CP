import ProblemDetail from "@/components/pages/app/problems/ProblemDetail";
import CodeEditor from "@/components/pages/app/problems/CodeEditor";
import prisma from "@/lib/prisma";
import { checkContest } from "@/lib/guard";
import { notFound } from "next/navigation";

interface ProblemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  await checkContest();

  const { slug } = await params;

  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: {
      testCases: {
        where: { isSample: true },
      },
    },
  });

  if (!problem) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-start">
      {/* Problem Description */}
      <ProblemDetail problem={problem} />

      {/* Code Editor */}
      <div className="lg:sticky lg:top-8">
        <CodeEditor problemId={problem.id} />
      </div>
    </div>
  );
}
