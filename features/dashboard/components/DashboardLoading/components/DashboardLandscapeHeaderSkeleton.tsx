import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const DashboardLandscapeHeaderSkeleton: FC = () => (
  <header className="grid min-h-(--touch) shrink-0 grid-cols-[clamp(21rem,42%,25rem)_minmax(0,1fr)] items-center border-b border-border bg-card/90 py-(--density-y)">
    <div className="flex items-center justify-between gap-2 px-4">
      <Skeleton className="h-8 w-32 rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
    <div className="px-(--density-x)">
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  </header>
);

export default DashboardLandscapeHeaderSkeleton;
