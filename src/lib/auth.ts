import prisma from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    if (process.env.VERCEL_ENV === "production") {
      return "https://nplc-cp.vercel.app";
    }
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

const baseURL = getBaseUrl();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: baseURL,
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
  trustedOrigins: [baseURL],
});

export type Session = typeof auth.$Infer.Session;
