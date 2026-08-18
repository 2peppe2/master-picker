import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

interface ScheduleCardSkeletonProps {
  layout?: "compact" | "desktop" | "landscape";
}

const layoutClassNames = {
  compact: {
    card: "rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5",
    periods: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4",
    period: "h-32 rounded-xl",
  },
  desktop: {
    card: "rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5",
    periods: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4",
    period: "h-32 rounded-xl",
  },
  landscape: {
    card: "rounded-lg border border-border/50 bg-card p-2 shadow-sm",
    periods: "mt-2 flex gap-2",
    period: "h-24 flex-1 rounded-lg",
  },
} as const;

const ScheduleCardSkeleton: FC<ScheduleCardSkeletonProps> = ({
  layout = "desktop",
}) => {
  const classes = layoutClassNames[layout];

  return (
    <div className={classes.card}>
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      <div className={classes.periods}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className={classes.period} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleCardSkeleton;
