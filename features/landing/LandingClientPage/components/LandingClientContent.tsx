"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { type FC, useMemo } from "react";
import Translate from "@/common/components/translate/Translate";
import { cn } from "@/lib/utils";
import ProgramSelector from "@/features/landing/components/ProgramSelector";
import MasterSelector from "@/features/landing/components/MasterSelector";
import YearSelector from "@/features/landing/components/YearSelector";
import LoadingDots from "@/features/landing/components/LoadingDots";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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
        "landscape-phone:max-w-3xl landscape-phone:gap-3",
      )}
    >
      <div
        data-protonpass-ignore="true"
        className={cn(
          "flex w-full flex-col items-center gap-4",
          "landscape-phone:flex-row landscape-phone:items-start",
          "landscape-phone:gap-3",
        )}
      >
      <div className="w-full">
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

      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          program
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
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
      </div>

      <div
        className={`flex w-full flex-col items-center gap-2 transition-all duration-300 ease-in-out ${
          year
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
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
      </div>

      <Button
        onClick={getStarted}
        className="h-12 w-full text-lg landscape-phone:max-w-80"
        disabled={!master || isLoadingGuide}
      >
        {isLoadingGuide && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoadingGuide ? (
          <LoadingDots text={translate("_running_to_guide")} />
        ) : (
          <Translate text="_get_started" />
        )}
      </Button>

      <Button variant="link" asChild className="-mt-1 h-auto py-1">
        <Link href="/about">
          <Translate text="_learn_more_about_the_project" />
        </Link>
      </Button>
    </div>
  );
};

export default LandingClientContent;
