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
    <div className="flex items-center gap-2 py-2.5 px-4 bg-sky-500/10 border-b border-sky-500/20 w-full justify-center">
      <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
      <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold tracking-wide">
        <Translate
          text="_dashboard_disclaimer_full"
          components={[
            <a
              key="liu-link"
              className="text-sky-600 dark:text-sky-400 hover:underline underline-offset-2 font-bold"
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
