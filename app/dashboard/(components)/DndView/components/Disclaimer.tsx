"use client";

import { useProgramId } from "@/app/dashboard/(store)/preferences/hooks/useProgramId";
import { useProgram } from "@/app/dashboard/(store)/preferences/hooks/useProgram";
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
        MasterPicker is a third-party site. Always verify content via the{" "}
        <a
          className="hover:underline"
          href={programLink}
          target="_blank"
          rel="noreferrer"
        >
          LiU program page
        </a>
        .
      </span>
    </div>
  );
};

export default Disclaimer;
