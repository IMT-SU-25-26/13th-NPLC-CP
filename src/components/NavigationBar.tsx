"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

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

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              13th NPLC CP
            </Link>
            <Link
              href="/problems"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Problems
            </Link>
          </div>

          {isLoading ? (
            <div className="flex gap-4">
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="text-gray-900 font-medium">
                Welcome, <span className="font-bold">{user.name}</span>!
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-white bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="px-6 py-2 text-blue-600 bg-white border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
