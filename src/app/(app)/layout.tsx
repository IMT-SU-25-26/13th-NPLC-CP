import { ContestTimer } from "@/components/app/leaderboard/contest-timer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="z-[5] w-full justify-start items-center flex flex-col pt-20 md:pt-24 lg:pt-28">
      <div className="max-w-[75%] flex flex-col justify-center items-center gap-4 w-full mx-auto py-8 px-4">
        <ContestTimer />
        {children}
      </div>
    </div>
  );
}
