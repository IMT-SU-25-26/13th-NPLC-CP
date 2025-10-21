import ProblemDetail from "@/components/pages/problems/ProblemDetail";
import CodeEditor from "@/components/pages/problems/CodeEditor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProblemPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProblemPage({ params }: ProblemPageProps) {
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
    <div className="relative mt-[5%] z-[10] w-full flex flex-col justify-start items-start">
      <div className="max-w-[77%] mx-auto p-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-start">
          {/* Problem Description */}
          <ProblemDetail problem={problem} />

          {/* Code Editor */}
          <div className="lg:sticky lg:top-8">
            <CodeEditor problemId={problem.id} problemTitle={problem.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
