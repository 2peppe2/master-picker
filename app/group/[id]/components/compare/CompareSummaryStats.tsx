"use client";

import { BookOpenText, Layers3, UsersRound } from "lucide-react";
import { FC } from "react";

interface CompareSummaryStatsProps {
  sharedCount: number;
  overlapPercentage: number;
  totalCount: number;
}

const CompareSummaryStats: FC<CompareSummaryStatsProps> = ({
  sharedCount,
  overlapPercentage,
  totalCount,
}) => (
  <div className="grid gap-3 sm:grid-cols-3">
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UsersRound className="size-4" />
        Shared
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {sharedCount}
      </p>
    </div>
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Layers3 className="size-4" />
        Overlap
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {overlapPercentage}%
      </p>
    </div>
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BookOpenText className="size-4" />
        Total
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">
        {totalCount}
      </p>
    </div>
  </div>
);

export default CompareSummaryStats;
