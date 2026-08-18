import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const DashboardDesktopHeaderSkeleton: FC = () => (
  <div className="shrink-0 border-b border-border/50 bg-card">
    <Skeleton className="h-9 w-full rounded-none" />
    <div className="flex items-center gap-4 border-b px-6 py-4 xl:px-8">
      <Skeleton className="h-8 flex-1 rounded-full" />
      <Skeleton className="size-10 rounded-lg" />
    </div>
  </div>
);

export default DashboardDesktopHeaderSkeleton;
