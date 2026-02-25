import MastersRequirementsSkeleton from "./(mastersRequirementsBar)/components/MastersRequirementsBarSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const CourseCardSkeleton = () => (
  <div className="h-40 w-40 rounded-xl border bg-card p-4 flex flex-col justify-between">
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
    <div className="flex flex-wrap gap-1">
      <Skeleton className="h-4 w-10 rounded-full" />
      <Skeleton className="h-4 w-12 rounded-full" />
      <Skeleton className="h-4 w-8 rounded-full" />
    </div>
  </div>
);

const DrawerSkeleton = () => (
  <aside className="bg-card border-r border-primary/10 sticky top-0 h-screen overflow-hidden">
    <div
      className="border-l shadow-lg
        h-full sticky shrink-0 flex flex-col overflow-hidden
        2xl:w-[550px] 2xl:min-w-[550px] w-[400px] min-w-[400px] pb-1"
    >
      <div className="p-4 shrink-0 z-10">
        <div className="flex gap-4 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-4 pt-1">
        <div className="grid 2xl:grid-cols-3 grid-cols-2 justify-items-center gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <CourseCardSkeleton key={`drawer-card-${i}`} />
          ))}
        </div>
      </div>
    </div>
  </aside>
);

const PeriodSkeleton = ({ index }: { index: number }) => (
  <div className="flex flex-col gap-2" key={`period-${index}`}>
    <Skeleton className="h-4 w-24" />
    <div className="flex w-full gap-5 overflow-hidden p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={`block-${index}-${i}`} className="h-40 w-40 rounded-xl" />
      ))}
    </div>
  </div>
);

const SemesterSkeleton = ({ index }: { index: number }) => (
  <div className="w-full rounded-xl border bg-card p-4 flex flex-col gap-4">
    <Skeleton className="h-5 w-72" />
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <PeriodSkeleton key={`semester-${index}-period-${i}`} index={i} />
      ))}
    </div>
  </div>
);

const HeaderSkeleton = () => (
  <header className="bg-card sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-opacity-80">
    <div className="px-8 h-25 flex items-center justify-between gap-6">
      <div className="flex flex-col w-full border-r h-12 px-4 items-center">
        <MastersRequirementsSkeleton />
        <div className="mt-4">
          <Skeleton className="h-3 w-72" />
        </div>
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  </header>
);

const DashboardLoading = () => {
  return (
    <div className="grid [grid-template-columns:auto_1fr] relative min-h-screen items-start">
      <DrawerSkeleton />

      <main className="flex flex-col h-screen bg-black/50 min-w-0 w-full relative">
        <HeaderSkeleton />

        <div className="bg-background overflow-y-auto flex flex-col flex-1 px-8 gap-4 py-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <SemesterSkeleton key={`semester-${i}`} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardLoading;
