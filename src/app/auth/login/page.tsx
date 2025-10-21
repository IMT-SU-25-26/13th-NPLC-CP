import LoginForm from "@/components/pages/auth/LoginForm";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

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
    redirect("/problems");
  }

  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
