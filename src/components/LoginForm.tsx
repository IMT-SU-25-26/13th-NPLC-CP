"use client";

import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/problems",
        redirect: true,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reach the server. Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

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
      <div className="relative z-[5] max-w-md w-full space-y-6 backdrop-blur-2xl flex flex-col items-center justify-center rounded-xl shadow-lg border-[8px] border-[#FCE551] p-4">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-white">
            Login
          </h2>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="w-[80%] rounded-md border-2 border-red-400 bg-red-50/80 text-red-700 px-3 py-2"
          >
            {error}
          </div>
        )}

        <form className="space-y-6 w-[80%]" onSubmit={handleSubmit}>
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-white mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-2 bg-[#18182a]/80 border-2 border-[#FCF551] [text-shadow:_0_0_20px_rgba(0,255,255,1)] rounded-none text-[#75E8F0] overflow-x-auto whitespace-nowrap sm:text-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-white mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="relative block w-full px-3 py-2 bg-[#18182a]/80 border-2 border-[#FCF551] rounded-none text-[#75E8F0] [text-shadow:_0_0_20px_rgba(0,255,255,1)] overflow-x-auto whitespace-nowrap sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="flex justify-center w-full">
            <button
              type="submit"
              disabled={isLoading || loading}
              className={`group relative w-[80%] flex justify-center py-3 px-4 hover:cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-6 w-6 text-[#D787DF]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
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
                    Log in
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
                    Log in
                  </text>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
