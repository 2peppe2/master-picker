import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

const LandingLoading: FC = () => (
  <div className="flex flex-col items-center gap-8 w-full max-w-sm mt-[236px]">
    <Skeleton className="h-9 w-80" />
    <Skeleton className="h-9 w-80" />
    <div className="flex w-full flex-col items-center gap-3">
      <Skeleton className="h-9 w-80" />
      <Skeleton className="h-4 w-40" />
    </div>
    <Skeleton className="h-9 w-80" />
    <Skeleton className="h-4 w-48" />
  </div>
);

export default LandingLoading;
