import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

function AlreadyLoggedIn() {
  return (
    <>
      <h2 className="text-center text-4xl font-extrabold text-white">
        Already Logged In
      </h2>
      <p className="text-center text-lg text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,0.5)]">
        You are already authenticated!
      </p>
      <Link
        href="/problems"
        className="text-[#FCF551] hover:text-[#c651fc] underline transition-colors duration-200"
      >
        Go to Problems
      </Link>
    </>
  );
}

function LoginLoading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-[#FCE551] border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-center text-2xl font-bold text-[#FCE551]">
        Loading...
      </h2>
    </div>
  );
}

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <AlreadyLoggedIn />;
  }

  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
