"use client";

import { useProgramId } from "@/features/dashboard/state/preferences/hooks/useProgramId";
import { useProgram } from "@/features/dashboard/state/preferences/hooks/useProgram";
import Translate from "@/common/components/translate/Translate";
import { Info } from "lucide-react";
import { FC } from "react";

/** Icon + copy only, so the rotating desktop banner can reuse the same slide. */
export const DisclaimerMessage: FC = () => {
  const programId = useProgramId();
  const program = useProgram();

  const programLink = programId
    ? `https://studieinfo.liu.se/en/program/${program}/${programId}`
    : "https://studieinfo.liu.se/en/";

  return (
    <>
      <Info className="h-4 w-4 text-[rgb(0,100,89)] dark:text-[rgb(0,200,179)] shrink-0" />
      <span className="text-xs sm:text-xs text-foreground font-semibold tracking-normal text-center leading-tight">
        <Translate
          text="_dashboard_disclaimer_full"
          components={[
            <a
              key="liu-link"
              className="text-[rgb(0,100,89)] dark:text-[rgb(0,200,179)] underline underline-offset-2 font-bold whitespace-nowrap"
              href={programLink}
              target="_blank"
              rel="noreferrer"
            />,
          ]}
        />
      </span>
    </>
  );
};

const Disclaimer: FC = () => (
  <div className="flex items-center gap-2 py-2 px-4 bg-[rgb(0,200,179)]/25 dark:bg-[rgb(0,200,179)]/10 border-b border-[rgb(0,200,179)]/20 w-full justify-center overflow-hidden">
    <DisclaimerMessage />
  </div>
);

export default Disclaimer;
