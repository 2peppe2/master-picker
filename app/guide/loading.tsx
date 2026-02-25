import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SummaryCardSkeleton = () => (
  <div className="rounded-2xl border p-4 bg-card">
    <Skeleton className="h-3 w-36" />
    <Skeleton className="mt-3 h-7 w-14" />
    <Skeleton className="mt-2 h-3 w-28" />
  </div>
);

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

const CompulsoryCardSkeleton = () => (
  <Card className="mt-10">
    <CardHeader>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-44" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <CourseCardSkeleton key={`compulsory-${i}`} />
        ))}
      </div>
    </CardContent>
  </Card>
);

const ElectiveCardSkeleton = ({ index }: { index: number }) => (
  <Card className="mt-8">
    <CardHeader>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardHeader>
    <CardContent className="py-4">
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <CourseCardSkeleton key={`elective-${index}-${i}`} />
        ))}
      </div>
    </CardContent>
  </Card>
);

const ProgressCardSkeleton = () => (
  <div className="fixed bottom-0 w-full z-20 flex justify-center p-4 bg-gradient-to-t from-background via-background/60 to-transparent">
    <div className="w-6xl rounded-2xl border bg-card p-6 shadow-2xl ring-1 ring-foreground/5">
      <div className="flex items-center gap-8">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
            <div className="h-full w-1/3 bg-muted" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="shrink-0">
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  </div>
);

const GuideLoading = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl pb-40 pt-24">
        <header className="flex flex-col gap-2">
          <Skeleton className="h-6 w-56 rounded-full" />
          <Skeleton className="h-8 w-2/3" />
          <div className="mt-4 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3 pt-4">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>

        <CompulsoryCardSkeleton />

        {[0, 1].map((index) => (
          <ElectiveCardSkeleton key={`elective-card-${index}`} index={index} />
        ))}
      </div>

      <ProgressCardSkeleton />
    </div>
  );
};

export default GuideLoading;
