import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const DashboardCompactHeaderSkeleton: FC = () => (
  <header className="shrink-0 border-b border-border bg-card/90">
    <Skeleton className="h-8 w-full rounded-none" />
    <div className="flex min-h-16 items-center justify-between border-b border-border/50 px-4 py-3 sm:px-6">
      <Skeleton className="h-10 w-36 rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="size-10 rounded-lg" />
        <Skeleton className="size-10 rounded-lg" />
      </div>
    </div>
    <div className="bg-muted/10 px-4 py-2 sm:px-6">
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  </header>
);

export default DashboardCompactHeaderSkeleton;
