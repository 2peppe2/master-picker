import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import LandingSelectorLoading from "./LandingSelectorLoading";
import type { FC } from "react";

const LandingFormLoading: FC = () => (
  // One selector, not three: only the program step is revealed on first paint.
  <div
    className={cn(
      "flex flex-col items-center gap-4 w-full max-w-80",
      "landscape-phone:w-1/2 landscape-phone:gap-3",
    )}
  >
    <LandingSelectorLoading />
    <Skeleton className="h-11 w-full rounded-lg sm:h-12 landscape-phone:h-10" />
  </div>
);

export default LandingFormLoading;
