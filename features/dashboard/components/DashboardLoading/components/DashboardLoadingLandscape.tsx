import DashboardLandscapeHeaderSkeleton from "./DashboardLandscapeHeaderSkeleton";
import DashboardDrawerSkeleton from "./DashboardDrawerSkeleton";
import DashboardScheduleSkeleton from "./DashboardScheduleSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const DashboardLoadingLandscape: FC = () => (
  <div
    data-dashboard-loading-layout="landscape"
    className="hidden h-[100dvh] w-full flex-col overflow-hidden bg-background landscape-phone:!flex"
  >
    <DashboardLandscapeHeaderSkeleton />
    <div className="grid min-h-0 w-full flex-1 grid-cols-[clamp(21rem,42%,25rem)_minmax(0,1fr)] overflow-hidden">
      <DashboardDrawerSkeleton layout="landscape" />
      <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <Skeleton className="h-8 w-full shrink-0 rounded-none" />
        <DashboardScheduleSkeleton layout="landscape" />
      </main>
    </div>
  </div>
);

export default DashboardLoadingLandscape;
