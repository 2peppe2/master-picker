"use client";

import { useProgramId } from "@/app/dashboard/(store)/preferences/hooks/useProgramId";
import { useProgram } from "@/app/dashboard/(store)/preferences/hooks/useProgram";
import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

const Disclaimer: FC = () => {
  const programId = useProgramId();
  const program = useProgram();

  const programLink = programId
    ? `https://studieinfo.liu.se/en/program/${program}/${programId}`
    : "https://studieinfo.liu.se/en/";

  return (
    <div className="flex items-center gap-2 mt-4 justify-center">
      <span className="text-xs text-muted-foreground mt-1">
        <Translate text="_dashboard_disclaimer_text" />{" "}
        <a
          className="underline hover:text-sky-600 dark:hover:text-sky-400"
          href={programLink}
          target="_blank"
          rel="noreferrer"
        >
          <Translate text="_dashboard_disclaimer_link" />
        </a>
        .
      </span>
    </div>
  );
};

export default Disclaimer;
