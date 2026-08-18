import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FC } from "react";

const LandingHeaderLoading: FC = () => (
  <header className="flex w-full flex-col items-center px-2 py-5 sm:px-4 sm:py-6 landscape-phone:py-0">
    <div className="mb-4 flex items-center justify-center gap-3 sm:gap-4 landscape-phone:mb-2 landscape-phone:gap-2">
      <Skeleton className="size-14 rounded-2xl sm:size-16 landscape-phone:size-10" />
      <Skeleton
        className={cn(
          "h-10 w-56 rounded-xl sm:h-12 sm:w-72 md:h-16 md:w-[480px]",
          "landscape-phone:h-9 landscape-phone:w-48",
        )}
      />
    </div>
    <Skeleton className="mb-6 h-5 w-64 max-w-full sm:mb-8 sm:h-6 sm:w-[540px] landscape-phone:mb-0 landscape-phone:h-4 landscape-phone:w-56" />
  </header>
);

export default LandingHeaderLoading;
