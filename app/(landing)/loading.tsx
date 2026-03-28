import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const LandingLoading: FC = () => (
  <div className="min-h-screen relative">
    <div className="absolute top-4 right-4 z-10">
      <Skeleton className="h-9 w-20 rounded-lg" />
    </div>
    <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
      <header className="w-full py-6 px-4 flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Skeleton className="size-[70px] rounded-2xl" />
          <Skeleton className="h-16 w-80 md:w-[480px] rounded-xl" />
        </div>
        <Skeleton className="h-6 w-64 md:w-[540px] mb-8" />
      </header>
      <LandingFormLoading />
    </main>
  </div>
);

export default LandingLoading;

export const LandingFormLoading: FC = () => (
  <div className="flex flex-col items-center gap-8 w-full max-w-sm mt-8">
    <Skeleton className="h-12 w-80 rounded-lg" />
    <Skeleton className="h-12 w-80 rounded-lg" />
    <div className="flex w-full flex-col items-center gap-3">
      <Skeleton className="h-12 w-80 rounded-lg" />
      <Skeleton className="h-4 w-40" />
    </div>
    <Skeleton className="h-12 w-80 rounded-lg" />
    <Skeleton className="h-4 w-48" />
  </div>
);
