import { useState, useEffect, useMemo } from "react";
import { ProcessedMaster } from "../types";
import {
  getMastersWithRequirements,
  MastersWithRequirements,
} from "@/app/actions/getMasters";
import { useEvaluateMasterProgress } from "./useEvaluateMasterProgress";

interface UseProcessedMastersArgs {
  program?: string;
}

export const useProcessedMasters = ({ program }: UseProcessedMastersArgs) => {
  const [mastersWithRequirements, setMastersWithRequirements] =
    useState<MastersWithRequirements | null>(null);

  const evaluateMasterProgress = useEvaluateMasterProgress();

  useEffect(() => {
    getMastersWithRequirements(program).then(setMastersWithRequirements);
  }, [program]);

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

  return { processed, isLoading: !mastersWithRequirements };
};
