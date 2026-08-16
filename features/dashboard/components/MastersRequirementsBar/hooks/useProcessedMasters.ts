"use client";

import { useStartingYear } from "@/features/dashboard/state/preferences/hooks/useStartingYear";
import { useEvaluateMasterProgress } from "./useEvaluateMasterProgress";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProcessedMaster } from "../types";
import {
  getMastersWithRequirements,
  MastersWithRequirements,
} from "@/app/actions/getMasters";

interface UseProcessedMastersArgs {
  program: string;
}

/** Builds the ordered master-progress presentation model for a program. */
export const useProcessedMasters = ({ program }: UseProcessedMastersArgs) => {
  const evaluateMasterProgress = useEvaluateMasterProgress();
  const startingYear = useStartingYear();

  const { data: mastersWithRequirements, isLoading } =
    useQuery<MastersWithRequirements>({
      queryKey: ["master-requirements", program, startingYear],
      queryFn: () => getMastersWithRequirements(startingYear, program),
      enabled: Boolean(program && startingYear),
      staleTime: 5 * 60 * 1000,
    });

  const processed = useMemo(() => {
    if (!mastersWithRequirements) {
      return [];
    }

    return mastersWithRequirements
      .map((master) => {
        const rawRequirements = master.requirements.flatMap(
          (req) => req.requirements,
        );

        const evaluation = evaluateMasterProgress(
          master.master,
          rawRequirements,
        );

        return {
          master: master.master,
          name: master.name ?? "Unknown master",
          requirements: evaluation.allRequirementsWithProgress,
          fulfilled: evaluation.fulfilled,
          progress: evaluation.progress,
        };
      })
      .sort((a, b) => {
        // Prioritize completed masters (100%)
        if (a.progress === 100 && b.progress !== 100) return -1;

        if (b.progress === 100 && a.progress !== 100) return 1;

        // Sort by highest progress percentage
        if (b.progress !== a.progress) return b.progress - a.progress;

        // Alphabetical fallback
        return a.master.localeCompare(b.master);
      }) satisfies ProcessedMaster[];
  }, [mastersWithRequirements, evaluateMasterProgress]);

  return { processed, isLoading };
};
