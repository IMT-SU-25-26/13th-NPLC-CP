import { Role } from "@prisma/client";

export interface User{
    name: string;
    role: Role;
}