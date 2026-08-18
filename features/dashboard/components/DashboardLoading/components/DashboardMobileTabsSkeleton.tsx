import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const DashboardMobileTabsSkeleton: FC = () => (
  <div className="shrink-0 rounded-t-2xl border-x border-t border-border/60 bg-background/95 px-3 pb-[calc(0.25rem+env(safe-area-inset-bottom))] pt-1">
    <div className="mx-auto grid min-h-(--touch) w-full max-w-sm grid-cols-2 gap-3 px-3 py-1">
      <Skeleton className="h-7 rounded-full" />
      <Skeleton className="h-7 rounded-full" />
    </div>
  </div>
);

export default DashboardMobileTabsSkeleton;
