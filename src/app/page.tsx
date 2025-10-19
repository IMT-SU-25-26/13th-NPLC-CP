import Image from "next/image";
import Link from "next/link";

export default async function Home() {
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
      ></Image>
      <Image
        src={"/backgrounds/BangunanBelakangBiru.svg"}
        alt="purple"
        width={100}
        height={100}
        className=" z-[1] w-full h-auto absolute bottom-[0]"
      ></Image>
      <Image
        src={"/backgrounds/Stairs.svg"}
        alt="purple"
        width={100}
        height={100}
        className="z-[4] w-full h-auto absolute bottom-[-2.5%]"
      ></Image>
      <div className="relative z-[100] w-[80%] md:w-[70%] lg:w-[70%] xl:w-[45%] backdrop-blur-2xl flex  flex-col items-center justify-center gap-4 lg:gap-6 p-6 lg:p-12 rounded-xl shadow-lg border-[8px] border-[#FCE551]">
        {/* Auth buttons in top right */}

        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            13th NPLC Competitive Programming
          </h1>
          <p className="text-xl text-white mb-8">
            Practice, compete, and improve your coding skills
          </p>
          <Link
            href="/problems"
            className="multiple-regis-button group flex 
              w-[60%] sm:w-[25%] lg:w-[30%] sm:mt-[-1rem] md:mt-[0rem] lg:mt-[0rem]"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 417 138"
              className="cursor-target"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 117.09H41.3058L0 96.9246V117.09Z"
                fill="#661109"
                className={`${"group-hover:fill-[#000000]"} transition-colors duration-200`}
              />
              <path
                d="M98.49 0L0 38.8754V85.6927L64.3021 117.09H309.815L408.305 78.2145V0H98.49Z"
                fill="#661109"
                className={`${"group-hover:fill-[#000000] "} transition-colors duration-200`}
              />
              <path
                d="M8.69482 126.217H50.0006L8.69482 106.044V126.217Z"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc]"} transition-colors duration-200`}
              />
              <path
                d="M107.177 9.12653L8.69482 47.9947V94.8193L72.9969 126.216H318.51L417 87.341V9.12653H107.177Z"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc] "} transition-colors duration-200`}
              />
              <path
                d="M72.6392 132.396H271.941V137.262H72.6392"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc] "} transition-colors duration-200`}
              />
              <path
                d="M8.56348 132.396H49.8693V137.262H8.56348"
                fill={`#FCF551`}
                className={`${"group-hover:fill-[#c651fc] "} transition-colors duration-200`}
              />
              <text
                x="200"
                y="75"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="18"
                fontWeight="500"
                className="text-[#D787DF] text-4xl font-rubik-glitch group-hover:text-[#D787DF]"
              >
                Solve Problem
              </text>
              <text
                x="205"
                y="70"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="18"
                fontWeight="500"
                className="text-[#75E7F0] text-4xl font-rubik-glitch group-hover:text-[#75E7F0]"
              >
                Solve Problem
              </text>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
