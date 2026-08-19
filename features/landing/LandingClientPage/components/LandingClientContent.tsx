"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { type FC, useMemo } from "react";
import Translate from "@/common/components/translate/Translate";
import { cn } from "@/lib/utils";
import ProgramSelector from "@/features/landing/components/ProgramSelector";
import MasterSelector from "@/features/landing/components/MasterSelector";
import YearSelector from "@/features/landing/components/YearSelector";
import RevealStep from "@/features/landing/components/RevealStep";
import LoadingLabel from "@/common/components/loading/LoadingLabel";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { LandingClientPageProps } from "../types";
import { useLandingSelection } from "../hooks/useLandingSelection";
import { useLandingNavigation } from "../hooks/useLandingNavigation";

const LandingClientContent: FC<LandingClientPageProps> = ({
  programs,
  initialSelection,
}) => {
  const translate = useCommonTranslate();
  const { selection, updateSelection } = useLandingSelection(initialSelection);
  const { program, master, year } = selection;
  const { destination, getStarted, pickLater } = useLandingNavigation({
    master,
    program,
    year,
  });
  const activeProgram = useMemo(
    () => programs.find((item) => item.program === program) ?? null,
    [program, programs],
  );
  const isLoadingDashboard = destination === "dashboard";
  const isLoadingGuide = destination === "guide";

  if (!programs) {
    return <Translate text="_no_programs_found" />;
  }

  return (
    <div
      className={cn(
        "relative flex w-full max-w-80 flex-col items-center gap-4",
        "landscape-phone:w-1/2 landscape-phone:gap-3",
      )}
    >
      <div
        data-protonpass-ignore="true"
        className={cn(
          "flex w-full flex-col items-center gap-4",
          "landscape-phone:gap-3",
        )}
      >
        <div className="w-full animate-landing-rise [animation-delay:120ms]">
          <ProgramSelector
            programs={programs}
            value={program}
            onValueChange={(nextProgram) =>
              updateSelection({
                program: nextProgram,
                year: null,
                master: null,
              })
            }
          />
        </div>

        <RevealStep show={Boolean(program)}>
          <YearSelector
            activeProgram={activeProgram}
            value={year}
            onValueChange={(nextYear) =>
              updateSelection({
                program,
                year: nextYear,
                master: null,
              })
            }
          />
        </RevealStep>

        <RevealStep show={Boolean(year)}>
          <div className="flex w-full flex-col items-center gap-2">
            <MasterSelector
              activeProgram={activeProgram}
              year={year}
              value={master}
              onValueChange={(nextMaster) =>
                updateSelection({
                  program,
                  year,
                  master: nextMaster,
                })
              }
              isLoading={isLoadingDashboard}
              onPickLater={pickLater}
            />
          </div>
        </RevealStep>
      </div>

      <Button
        onClick={getStarted}
        className={cn(
          "h-11 w-full text-base transition-transform active:scale-[0.98]",
          "sm:h-12 sm:text-lg landscape-phone:h-10 landscape-phone:text-base",
          "animate-landing-rise [animation-delay:180ms]",
        )}
        disabled={!master || isLoadingGuide}
      >
        {isLoadingGuide && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoadingGuide ? (
          <LoadingLabel>{translate("_running_to_guide")}</LoadingLabel>
        ) : (
          <Translate text="_get_started" />
        )}
      </Button>
    </div>
  );
};

export default LandingClientContent;
