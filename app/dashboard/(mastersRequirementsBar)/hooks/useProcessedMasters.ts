import { useState, useEffect, useMemo } from "react";
import { ProcessedMaster } from "../types";
import {
  getMastersWithRequirements,
  MastersWithRequirements,
} from "@/app/actions/getMasters";
import { useEvaluateMasterProgress } from "./useEvaluateMasterProgress";

interface UseProcessedMasters {
  program?: string;
}

export const useProcessedMasters = ({ program }: UseProcessedMasters) => {
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
        const requirements = master.requirements.flatMap(
          (req) => req.requirements,
        );
        return {
          requirements,
          master: master.master,
          name: master.name ?? "Unknown master",
          ...evaluateMasterProgress(requirements),
        };
      })
      .sort((a, b) => {
        if (a.progress === 100 && b.progress !== 100) return -1;
        if (b.progress === 100 && a.progress !== 100) return 1;
        if (b.progress !== a.progress) return b.progress - a.progress;
        return a.master.localeCompare(b.master);
      }) satisfies ProcessedMaster[];
  }, [mastersWithRequirements, evaluateMasterProgress]);

  return { processed, isLoading: !mastersWithRequirements };
};
