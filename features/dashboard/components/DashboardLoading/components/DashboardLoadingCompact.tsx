import DashboardCompactHeaderSkeleton from "./DashboardCompactHeaderSkeleton";
import DashboardMobileTabsSkeleton from "./DashboardMobileTabsSkeleton";
import DashboardScheduleSkeleton from "./DashboardScheduleSkeleton";
import type { FC } from "react";

const DashboardLoadingCompact: FC = () => (
  <div
    data-dashboard-loading-layout="compact"
    className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background lg:hidden landscape-phone:!hidden"
  >
    <DashboardCompactHeaderSkeleton />
    <DashboardScheduleSkeleton layout="compact" />
    <DashboardMobileTabsSkeleton />
  </div>
);

export default DashboardLoadingCompact;
