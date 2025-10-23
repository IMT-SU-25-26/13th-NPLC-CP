import {
  Prisma,
  User,
  Problem,
  Discussion,
  Reply,
  Contest,
  Submission,
} from "@prisma/client";

export type { User, Problem, Discussion, Reply, Contest, Submission };

// Discussion
export const DiscussionInclude = Prisma.validator<Prisma.DiscussionInclude>()({
  author: true,
  replies: {
    include: {
      author: true,
    },
  },
});

export type FullDiscussion = Prisma.DiscussionGetPayload<{
  include: typeof DiscussionInclude;
}>;

// Reply
export const ReplyInclude = Prisma.validator<Prisma.ReplyInclude>()({
  author: true,
});

export type FullReply = Prisma.ReplyGetPayload<{
  include: typeof ReplyInclude;
}>;

// Problem
export const ProblemInclude = Prisma.validator<Prisma.ProblemInclude>()({
  testCases: true,
});

export type FullProblem = Prisma.ProblemGetPayload<{
  include: typeof ProblemInclude;
}>;

// Submission
export const SubmissionInclude = Prisma.validator<Prisma.SubmissionInclude>()({
  user: true,
});

export type FullSubmission = Prisma.SubmissionGetPayload<{
  include: typeof SubmissionInclude;
}>;
