import Leaderboard from "@/components/Leaderboard";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#111114] to-[#090A1E] flex flex-col justify-center items-center overflow-hidden">
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
      <div className="z-[1] absolute w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top"></div>
      <div className="z-[0] absolute bottom-[-5rem] bg-[#97156A] w-[1100px] h-[900px] rounded-full blur-[100px]"></div>
      <div className="z-[3] w-full justify-start items-center flex flex-col">
        <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-[#FCF551] [text-shadow:_0_0_30px_rgba(252,245,81,0.8)] mb-4">
            Leaderboard
          </h1>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
