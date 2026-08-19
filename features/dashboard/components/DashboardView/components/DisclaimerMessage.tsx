"use client";

import { useProgramId } from "@/features/dashboard/state/preferences/hooks/useProgramId";
import { useProgram } from "@/features/dashboard/state/preferences/hooks/useProgram";
import Translate from "@/common/components/translate/Translate";
import { Info } from "lucide-react";
import { FC } from "react";

const DisclaimerMessage: FC = () => {
  const programId = useProgramId();
  const program = useProgram();
  const programLink = programId
    ? `https://studieinfo.liu.se/en/program/${program}/${programId}`
    : "https://studieinfo.liu.se/en/";

  return (
    <>
      <Info className="h-4 w-4 text-brand-strong shrink-0" />
      <span className="text-xs sm:text-xs text-foreground font-semibold tracking-normal text-center leading-tight">
        <Translate
          text="_dashboard_disclaimer_full"
          components={[
            <a
              key="liu-link"
              className="text-brand-strong underline underline-offset-2 font-bold whitespace-nowrap"
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

export default DisclaimerMessage;
