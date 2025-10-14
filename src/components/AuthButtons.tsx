"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AuthButtons() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/get-session");
      if (response.ok) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          if (data.user) {
            setUser(data.user);
          }
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="relative z-[500] flex justify-end gap-4">
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="elative z-[500] flex justify-end items-center gap-4">
        <div className="text-white font-medium">
          Welcome, <span className="font-bold">{user.name}</span>!
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 text-white bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-[500] flex justify-end gap-4">
      <Link
        href="/auth/login"
        className="px-6 py-2 text-blue-600 bg-white border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
      >
        Sign In
      </Link>
      <Link
        href="/auth/register"
        className="px-6 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
      >
        Sign Up
      </Link>
    </div>
  );
}
