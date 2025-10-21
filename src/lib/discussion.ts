// import prisma from "@/lib/prisma";

// export async function getAllDiscussions() {
//     const discussions = await prisma.discussions.findMany({
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       _count: {
//         select: {
//           User: true,
//         },
//       },
//     },
//   });
// }