"use server";

import prisma from "@/lib/prisma";

export async function getSubmissionByUserId(userId: string) {
    const submissions = await prisma.submission.findMany({
        where: { userId: userId },
        include: {
            user: true,
        },
    });
    return submissions;
}