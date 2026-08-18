import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const ScheduleCardSkeleton: FC = () => (
  <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5">
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="size-5 rounded-full" />
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-32 rounded-xl" />
      ))}
    </div>
  </div>
);

const CourseCardSkeleton: FC = () => <Skeleton className="h-40 rounded-xl" />;

const DashboardLoading: FC = () => {
  const translate = useCommonTranslate();

  return (
    <div
      data-dashboard-loading="true"
      role="status"
      aria-busy="true"
      aria-label={translate("_loading_dashboard")}
      className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background"
    >
      <div className="flex h-full min-h-0 flex-1">
        <aside className="hidden h-full w-[400px] shrink-0 border-r border-primary/10 bg-card lg:flex lg:flex-col 2xl:w-[550px]">
          <div className="flex flex-col gap-4 px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="size-10" />
              <Skeleton className="size-10" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4 overflow-hidden px-5 pb-5 2xl:grid-cols-3">
            {Array.from({ length: 12 }, (_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
          <div className="hidden shrink-0 border-b border-border/50 bg-card lg:block">
            <Skeleton className="h-11 w-full rounded-none" />
            <div className="flex items-center gap-4 border-b px-6 py-4 xl:px-8">
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="size-10" />
            </div>
          </div>

          <div className="flex shrink-0 flex-col border-b border-border/50 bg-card lg:hidden">
            <Skeleton className="h-11 w-full rounded-none" />
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <Skeleton className="h-10 w-36" />
              <div className="flex gap-2">
                <Skeleton className="size-10" />
                <Skeleton className="size-10" />
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6">
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-6 xl:px-8 xl:py-8">
            <ScheduleCardSkeleton />
            <ScheduleCardSkeleton />
            <div className="lg:hidden">
              <ScheduleCardSkeleton />
            </div>
          </div>

          <div className="flex h-13 shrink-0 items-center justify-around border-t border-border bg-card lg:hidden">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </main>
      </div>
      <span className="sr-only">{translate("_loading_dashboard")}</span>
    </div>
  );
};

export default DashboardLoading;
