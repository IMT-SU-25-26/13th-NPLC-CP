import prisma from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { createId } from "@paralleldrive/cuid2";
import { verifySync } from "@node-rs/bcrypt";
import { Role } from "@prisma/client";

// const appPath = "/cp";

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

        if (user.activeSessionToken) {
          throw new Error(
            "This account is already logged in on another device. Please log out from the other device first."
          );
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
  // cookies: {
  //   sessionToken: {
  //     name: `__Secure-cp-app.session-token`,
  //     options: {
  //       path: appPath,
  //       httpOnly: true,
  //       sameSite: "lax",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   callbackUrl: {
  //     name: `__Secure-cp-app.callback-url`,
  //     options: {
  //       path: appPath,
  //       httpOnly: true,
  //       sameSite: "lax",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   csrfToken: {
  //     name: `__Secure-cp-app.csrf-token`,
  //     options: {
  //       path: appPath,
  //       httpOnly: true,
  //       sameSite: "lax",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
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
      } else {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (!dbUser || dbUser.activeSessionToken !== token.activeSessionToken) {
          throw new Error("Invalid session");
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
