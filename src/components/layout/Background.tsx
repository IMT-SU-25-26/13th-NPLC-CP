import Image from "next/image";

export default function Background() {
  return (
    <>
      <div className="z-[3] fixed w-full h-full bg-gradient-to-b from-[0%] from-[#2a0335]/50 via-[43%] via-[#6258D1]/50 to-[100%] to-[#00CBC1]/50 blue-light-top pointer-events-none"></div>
      <div className="z-[0] fixed bottom-[-5rem] bg-[#97156A] w-full h-[90%] rounded-full blur-[100px] pointer-events-none"></div>
      <Image
        src="/backgrounds/BangunanDepanUngu.svg"
        alt="purple building"
        width={100}
        height={100}
        className="z-[2] w-full h-auto fixed bottom-[0] pointer-events-none"
      />
      <Image
        src="/backgrounds/BangunanBelakangBiru.svg"
        alt="blue building"
        width={100}
        height={100}
        className="z-[1] w-full h-auto fixed bottom-[0] pointer-events-none"
      />
      <Image
        src="/backgrounds/Stairs.svg"
        alt="stairs"
        width={100}
        height={100}
        className="z-[3] w-full h-auto fixed bottom-[-2.5%] pointer-events-none"
      />
    </>
  );
}
