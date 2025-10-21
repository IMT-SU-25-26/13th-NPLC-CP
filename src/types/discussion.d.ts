import { User } from "./user";

export interface Discussion {
    id: string;
    question: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    replies: Reply[];
}

export interface Reply {
    id: string;
    content: string;
    authorId: string;
    discussionId: string;
    createdAt: Date;
    updatedAt: Date;
    author: User;
    discussion: Discussion;
}