import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

function AlreadyLoggedIn() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
      <div className="z-[3] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px]"></div>
      <Image
        src={"/backgrounds/BangunanDepanUngu.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[2] w-full h-auto absolute bottom-[0]"
      />
      <Image
        src={"/backgrounds/BangunanBelakangBiru.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[1] w-full h-auto absolute bottom-[0]"
      />
      <Image
        src={"/backgrounds/Stairs.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[4] w-full h-auto absolute bottom-[-2.5%]"
      />
      <div className="relative z-[5] max-w-md w-full space-y-6 backdrop-blur-2xl flex flex-col items-center justify-center rounded-xl shadow-lg border-[8px] border-[#FCE551] p-8">
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
      </div>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
      <div className="z-[3] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px]"></div>
      <Image
        src={"/backgrounds/BangunanDepanUngu.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[2] w-full h-auto absolute bottom-[0]"
      />
      <Image
        src={"/backgrounds/BangunanBelakangBiru.svg"}
        alt="blue"
        width={100}
        height={100}
        className="z-[1] w-full h-auto absolute bottom-[0]"
      />
      <Image
        src={"/backgrounds/Stairs.svg"}
        alt="stairs"
        width={100}
        height={100}
        className="z-[4] w-full h-auto absolute bottom-[-2.5%]"
      />
      <div className="relative z-[5] max-w-md w-full space-y-6 backdrop-blur-2xl flex flex-col items-center justify-center rounded-xl shadow-lg border-[8px] border-[#FCE551] p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#FCE551] border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-center text-2xl font-bold text-[#FCE551]">
            Loading...
          </h2>
        </div>
      </div>
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
