"use client";

import { useProgramId } from "@/app/dashboard/(store)/preferences/hooks/useProgramId";
import { useProgram } from "@/app/dashboard/(store)/preferences/hooks/useProgram";
import Translate from "@/common/components/translate/Translate";
import { Info } from "lucide-react";
import { FC } from "react";

const Disclaimer: FC = () => {
  const programId = useProgramId();
  const program = useProgram();

  const programLink = programId
    ? `https://studieinfo.liu.se/en/program/${program}/${programId}`
    : "https://studieinfo.liu.se/en/";

  return (
    <div className="flex items-center gap-2 py-2 px-4 bg-[rgb(0,200,179)]/25 dark:bg-[rgb(0,200,179)]/10 border-b border-[rgb(0,200,179)]/20 w-full justify-center overflow-hidden">
      <Info className="h-4 w-4 text-[rgb(0,100,89)] dark:text-[rgb(0,200,179)] shrink-0" />
      <span className="text-[10px] sm:text-xs text-foreground font-semibold tracking-wide text-center leading-tight">
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
    </div>
  );
};

export default Disclaimer;
