import { getServerSession, type Session } from "next-auth";
import { authOptions } from "./auth";

export const getAuthSession = () => {
  return getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new Error("Unauthorized: No session found.");
  }

  return session.user;
};

export const getCurrentUserId = async () => {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No user ID found in session.");
  }

  return session.user.id;
};