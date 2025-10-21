import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[5] max-w-md w-full space-y-6 backdrop-blur-2xl flex flex-col items-center justify-center rounded-xl shadow-lg border-[8px] border-[#FCE551] p-8">
      {children}
    </div>
  );
}
