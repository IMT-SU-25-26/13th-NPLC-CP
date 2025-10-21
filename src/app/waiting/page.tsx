import Waiting from "@/components/pages/waiting/Waiting";
import { getActiveContest } from "@/services/contest";
import { ContestStatus } from "@prisma/client";

export default async function WaitingPage() {
  const contest = await getActiveContest();
  const status = contest?.status ?? ContestStatus.PENDING;

  return (
    <>
      <Waiting status={status} />
    </>
  );
}
