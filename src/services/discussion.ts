"use server";

import prisma from "@/lib/prisma";

export async function getAllDiscussions() {
  const discussion = await prisma.discussion.findMany({
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

export async function createDiscussion(data: {
  question: string;
  authorId: string;
}) {
  const discussion = await prisma.discussion.create({
    data: {
      question: data.question,
      authorId: data.authorId,
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

export async function createReply(data: {
  content: string;
  discussionId: string;
  authorId: string;
}) {
  const reply = await prisma.reply.create({
    data: {
      content: data.content,
      discussionId: data.discussionId,
      authorId: data.authorId,
    },
    include: {
      author: true,
    },
  });
  return reply;
}
