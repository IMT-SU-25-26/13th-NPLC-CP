import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { verifySync } from "@node-rs/bcrypt";
import { createId } from "@paralleldrive/cuid2";
import { Role } from "@prisma/client";

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 1 day

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("No password set for this user");
        }

        const isPasswordValid = verifySync(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const sessionToken = createId();

        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { activeSessionToken: sessionToken },
        });

        if (!updatedUser) {
          throw new Error("Failed to update user session");
        }

        return {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          activeSessionToken: updatedUser.activeSessionToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  events: {
    async signOut({ token }) {
      if (token.id) {
        await prisma.user.update({
          where: { id: token.id as string },
          data: { activeSessionToken: null },
        });
      }
    },
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/problems`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.activeSessionToken = user.activeSessionToken;
        token.sessionCreatedAt = Date.now();
      } else {
        if (
          token.sessionCreatedAt &&
          Date.now() - token.sessionCreatedAt > SESSION_TIMEOUT
        ) {
          throw new Error("Session expired due to inactivity");
        }

        if (token.id && token.activeSessionToken) {
          const currentUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { activeSessionToken: true },
          });

          if (
            !currentUser ||
            currentUser.activeSessionToken !== token.activeSessionToken
          ) {
            throw new Error(
              "Session invalidated - logged in from another device"
            );
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
