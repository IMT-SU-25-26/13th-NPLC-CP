"use server";

import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getAllDiscussions() {
  const discussion = await prisma.discussion.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
  });
  return discussion;
}

export async function getDiscussionById(id: string) {
  const discussion = await prisma.discussion.findUnique({
    where: { id },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
  });
  return discussion;
}

export async function getUserDiscussions(userId: string) {
  const discussions = await prisma.discussion.findMany({
    where: { authorId: userId },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
  });
  return discussions;
}

export async function createDiscussion(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const question = formData.get("question") as string;

  if (!title || !question) {
    throw new Error("Title and question are required");
  }

  await prisma.discussion.create({
    data: {
      title,
      question,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/discussions");
}

export async function createReply(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const content = formData.get("content") as string;
  const discussionId = formData.get("discussionId") as string;

  if (!content || !discussionId) {
    throw new Error("Content and discussionId are required");
  }

  await prisma.reply.create({
    data: {
      content,
      discussionId,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/discussions");
  revalidatePath(`/discussions/${discussionId}`);
}
