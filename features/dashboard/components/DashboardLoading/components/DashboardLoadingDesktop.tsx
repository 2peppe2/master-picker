import DashboardDesktopHeaderSkeleton from "./DashboardDesktopHeaderSkeleton";
import DashboardDrawerSkeleton from "./DashboardDrawerSkeleton";
import DashboardScheduleSkeleton from "./DashboardScheduleSkeleton";
import type { FC } from "react";

const DashboardLoadingDesktop: FC = () => (
  <div
    data-dashboard-loading-layout="desktop"
    className="hidden h-[100dvh] w-full overflow-hidden bg-background lg:grid lg:grid-cols-[400px_minmax(0,1fr)] landscape-phone:!hidden 2xl:grid-cols-[550px_minmax(0,1fr)]"
  >
    <DashboardDrawerSkeleton layout="desktop" />
    <main className="flex min-w-0 flex-col overflow-hidden">
      <DashboardDesktopHeaderSkeleton />
      <DashboardScheduleSkeleton layout="desktop" />
    </main>
  </div>
);

export default DashboardLoadingDesktop;
