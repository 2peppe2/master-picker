"use client";

import { useEvaluateMasterProgress } from "./hooks/useEvaluateMasterProgress";
import MasterProgressBadge from "./components/MasterProgressBadge";
import { useEffect, useState, useMemo } from "react";
import { ProcessedMaster } from "./types";
import {
  getMastersWithRequirements,
  MastersWithRequirements,
} from "@/app/actions/getMasters";
import _ from "lodash";

const MastersRequirementsBar = () => {
  const [mastersWithRequirements, setMastersWithRequirements] =
    useState<MastersWithRequirements | null>(null);
  const evaluateMasterProgress = useEvaluateMasterProgress();

  useEffect(() => {
    getMastersWithRequirements().then(setMastersWithRequirements);
  }, []);

  const processedMasters = useMemo(() => {
    if (!mastersWithRequirements) return [];

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

  if (!mastersWithRequirements) {
    return <MastersRequirementsSkeleton />;
  }

  return (
    <div className="flex items-baseline-last w-full h-full gap-4 min-w-0">
      <div className="hidden lg:flex items-center gap-3 text-muted-foreground shrink-0 select-none">
        <span className="text-sm font-medium text-zinc-400">
          Master&apos;s progress
        </span>
      </div>
      <div className="flex-1 overflow-x-auto no-scrollbar mask-gradient-right">
        <div className="flex items-center gap-3 pr-4 [&>*]:flex-1 [&>*]:min-w-0">
          {processedMasters.map((master) => (
            <MasterProgressBadge key={master.master} master={master} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MastersRequirementsSkeleton = () => (
  <div className="flex items-center gap-4 w-full animate-pulse opacity-50">
    <div className="h-8 w-8 rounded bg-white/10 shrink-0" />
    <div className="h-8 w-[1px] bg-white/10 shrink-0" />
    <div className="flex gap-2 overflow-hidden flex-1">
      {_.range(1, 6).map((i) => (
        <div
          key={`master_skeleton_${i}`}
          className="h-8 w-32 rounded border border-white/5 bg-white/5 shrink-0"
        />
      ))}
    </div>
  </div>
);

export default MastersRequirementsBar;
