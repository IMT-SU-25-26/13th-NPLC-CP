import { User } from "./user";
export interface discussion {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    user: User;
    replies?: Array<{
        id: string;
        user: User;
        content?: string;
        createdAt?: Date;
    }>;
}