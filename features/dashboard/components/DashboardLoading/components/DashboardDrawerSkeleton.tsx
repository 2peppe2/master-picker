import CourseCardSkeleton from "./CourseCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

interface DashboardDrawerSkeletonProps {
  layout: "desktop" | "landscape";
}

const layoutClassNames = {
  desktop: {
    controls: "flex flex-col gap-4 px-5 py-5",
    search: "h-10 flex-1",
    action: "size-10",
    filters: "h-14 w-full rounded-xl",
    grid: "grid min-h-0 grid-cols-2 gap-4 overflow-hidden px-5 pb-5 2xl:grid-cols-3",
  },
  landscape: {
    controls: "flex flex-col gap-2 px-4 py-2",
    search: "h-8 flex-1",
    action: "size-8",
    filters: "h-9 w-full rounded-lg",
    grid: "grid min-h-0 grid-cols-3 gap-2 overflow-hidden px-4 pb-3",
  },
} as const;

const DashboardDrawerSkeleton: FC<DashboardDrawerSkeletonProps> = ({
  layout,
}) => {
  const classes = layoutClassNames[layout];

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r border-primary/10 bg-card">
      <div className={classes.controls}>
      <div className="flex items-center justify-between gap-3">
          <Skeleton className={classes.search} />
          <Skeleton className={classes.action} />
          <Skeleton className={classes.action} />
        </div>
        <Skeleton className={classes.filters} />
      </div>
      <div className={classes.grid}>
        {Array.from({ length: 12 }, (_, index) => (
          <CourseCardSkeleton key={index} layout={layout} />
        ))}
      </div>
    </aside>
  );
};

export default DashboardDrawerSkeleton;
