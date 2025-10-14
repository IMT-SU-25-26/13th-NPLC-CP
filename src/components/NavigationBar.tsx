"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

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
    <nav className="z-[1000] fixed w-screen">
      <div className="max-w-[76%] mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Image
                src="/logos/NPLCLogo.webp"
                className="pointer-events-auto cursor-target w-[4rem] sm:w-[4rem] md:w-[6rem] lg:w-[8rem] xl:w-[12rem]"
                alt="Logo"
                width={200}
                height={200}
              />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex gap-4">
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                className="cursor-target pointer-events-auto w-full flex items-center"
                href="/problems"
              >
                <span className="relative group inline-block">
                  <svg
                    width="240"
                    height="68"
                    viewBox="0 0 240 68"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 sm:w-32 md:w-40 xl:w-[15rem]"
                  >
                    <path
                      d="M237.725 1.38439V19.2555L232.944 22.4684L232.434 22.8111V48.1608L232.943 48.5035L238.412 52.1852V66.6559H23.3789L1.40137 51.8785V1.38439H237.725Z"
                      fill="none"
                      fillOpacity="100"
                      stroke="#FCF551"
                      strokeWidth="2.30885"
                      className="transition-colors duration-200 group-hover:fill-[#fcf551] group-hover:fill-opacity-100"
                    />
                    <foreignObject x="0" y="0" width="100%" height="100%">
                      <div
                        style={{
                          backdropFilter: "blur(76.96px)",
                          clipPath: "url(#bgblur_0_784_144_clip_path)",
                          height: "100%",
                          width: "100%",
                        }}
                      ></div>
                    </foreignObject>
                    <path
                      d="M237.724 1.38428V19.2554L232.944 22.4683L232.433 22.811V48.1606L232.943 48.5034L238.412 52.1851V66.6558H23.3787L1.40112 51.8784V1.38428H237.724Z"
                      fill="transparent"
                      stroke="#FCF551"
                      strokeWidth="2.30885"
                      className="transition-colors duration-200 group-hover:fill-[#fcf551]"
                    />
                    <text
                      x="120"
                      y="38"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="currentColor"
                      fontSize="18"
                      fontWeight="500"
                      className="text-[#FCF551] text-xl sm:text-xl md:text-2xl group-hover:text-[#661108]"
                    >
                      Problems
                    </text>
                    <defs>
                      <clipPath id="bgblur_0_784_144_clip_path">
                        <path d="M237.724 1.38428V19.2554L232.944 22.4683L232.433 22.811V48.1606L232.943 48.5034L238.412 52.1851V66.6558H23.3787L1.40112 51.8784V1.38428H237.724Z" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="all-button cursor-target group flex 
              w-[60%] sm:w-[43%] lg:w-[40%] sm:mt-[-1rem] lg:mt-[0rem]"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 166 68"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 sm:w-20 md:w-24 lg:w-[7rem] xl:w-[10rem]"
                >
                  <foreignObject x="0" y="0" width="100%" height="100%">
                    <div
                      style={{
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        clipPath: "url(#bgblur_0_1190_15_clip_path)",
                        height: "100%",
                        width: "100%",
                      }}
                    ></div>
                  </foreignObject>
                  <path
                    d="M5.17285 50.248L4.83496 49.9092L1.15527 46.2227V23.6738L5.45703 19.3721L5.7959 19.0342V1.15527H163.766V17.5391L160.472 20.833L160.133 21.1709V48.2637L163.997 52.1279V66.4248H5.17285V50.248Z"
                    fill="#3D3D3D"
                    fillOpacity="0.31"
                    stroke="#FCF551"
                    strokeWidth="2.31"
                  />
                  <path
                    d="M5.48892 0.230103V18.7855L0.848145 23.4263V46.9303L4.86554 50.9554V67.81H166V51.879L162.136 48.0155V21.8794L165.769 18.2468V0.230103H5.48892Z"
                    fill="transparent"
                    stroke="#FCF551"
                    strokeWidth="2.30885"
                    className="transition-colors duration-200 group-hover:fill-[#fcf551]"
                  />
                  <text
                    x="83"
                    y="34"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    fontSize="18"
                    fontWeight="500"
                    className="text-[#FCF551] text-xl sm:text-xl md:text-2xl group-hover:text-[#661108]"
                  >
                    Logout
                  </text>
                  <defs>
                    <clipPath id="bgblur_0_1190_15_clip_path">
                      <path d="M5.17285 50.248L4.83496 49.9092L1.15527 46.2227V23.6738L5.45703 19.3721L5.7959 19.0342V1.15527H163.766V17.5391L160.472 20.833L160.133 21.1709V48.2637L163.997 52.1279V66.4248H5.17285V50.248Z" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="pointer-events-auto group flex items-center justify-center w-full"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 166 68"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 sm:w-20 md:w-24 lg:w-[7rem] xl:w-[10rem]"
                >
                  <foreignObject x="0" y="0" width="100%" height="100%">
                    <div
                      style={{
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        clipPath: "url(#bgblur_0_1190_15_clip_path)",
                        height: "100%",
                        width: "100%",
                      }}
                    ></div>
                  </foreignObject>
                  <path
                    d="M5.17285 50.248L4.83496 49.9092L1.15527 46.2227V23.6738L5.45703 19.3721L5.7959 19.0342V1.15527H163.766V17.5391L160.472 20.833L160.133 21.1709V48.2637L163.997 52.1279V66.4248H5.17285V50.248Z"
                    fill="#3D3D3D"
                    fillOpacity="0.31"
                    stroke="#FCF551"
                    strokeWidth="2.31"
                  />
                  <path
                    d="M5.48892 0.230103V18.7855L0.848145 23.4263V46.9303L4.86554 50.9554V67.81H166V51.879L162.136 48.0155V21.8794L165.769 18.2468V0.230103H5.48892Z"
                    fill="transparent"
                    stroke="#FCF551"
                    strokeWidth="2.30885"
                    className="transition-colors duration-200 group-hover:fill-[#fcf551]"
                  />
                  <text
                    x="83"
                    y="34"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    fontSize="18"
                    fontWeight="500"
                    className="text-[#FCF551] text-xl sm:text-xl md:text-2xl group-hover:text-[#661108]"
                  >
                    Login
                  </text>
                  <defs>
                    <clipPath id="bgblur_0_1190_15_clip_path">
                      <path d="M5.17285 50.248L4.83496 49.9092L1.15527 46.2227V23.6738L5.45703 19.3721L5.7959 19.0342V1.15527H163.766V17.5391L160.472 20.833L160.133 21.1709V48.2637L163.997 52.1279V66.4248H5.17285V50.248Z" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
