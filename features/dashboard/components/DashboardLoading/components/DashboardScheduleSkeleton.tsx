import ScheduleCardSkeleton from "./ScheduleCardSkeleton";
import type { FC } from "react";

interface DashboardScheduleSkeletonProps {
  layout: "compact" | "desktop" | "landscape";
}

const layoutClassNames: Record<DashboardScheduleSkeletonProps["layout"], string> = {
  compact:
    "flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-4 sm:px-5 sm:py-6",
  desktop:
    "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 py-6 xl:px-8 xl:py-8",
  landscape:
    "flex min-h-0 flex-1 flex-col gap-(--density-gap-y) overflow-hidden p-(--density-x)",
};

const DashboardScheduleSkeleton: FC<DashboardScheduleSkeletonProps> = ({
  layout,
}) => (
  <div className={layoutClassNames[layout]}>
    <ScheduleCardSkeleton layout={layout} />
    <ScheduleCardSkeleton layout={layout} />
    {layout === "compact" && <ScheduleCardSkeleton layout={layout} />}
  </div>
);

export default DashboardScheduleSkeleton;
