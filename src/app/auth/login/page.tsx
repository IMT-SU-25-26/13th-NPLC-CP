import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/session";
import { LoginForm } from "@/components/auth/login-form";

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
  const session = await getAuthSession();

  if (session) {
    redirect("/problems");
  }

  return (
    <div className="relative z-[5] max-w-md w-full space-y-6 backdrop-blur-2xl flex flex-col items-center justify-center rounded-xl shadow-lg border-[8px] border-[#FCE551] p-8">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
