import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import LandingSelectorLoading from "./LandingSelectorLoading";
import type { FC } from "react";

const LandingFormLoading: FC = () => (
  <div
    className={cn(
      "flex flex-col items-center gap-4 w-full max-w-80",
      "landscape-phone:max-w-3xl landscape-phone:gap-3",
    )}
  >
    <div className="flex w-full flex-col items-center gap-4 landscape-phone:flex-row landscape-phone:items-start landscape-phone:gap-3">
      <LandingSelectorLoading />
      <LandingSelectorLoading />
      <LandingSelectorLoading />
    </div>
    <Skeleton className="h-12 w-full rounded-lg landscape-phone:max-w-80" />
    <Skeleton className="h-4 w-48" />
  </div>
);

export default LandingFormLoading;
