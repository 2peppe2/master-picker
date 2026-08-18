import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FC } from "react";

/** Mirrors the landscape row layout in page.tsx so the swap doesn't jump. */
const LandingLoading: FC = () => (
  <div className="flex min-h-[100dvh] flex-col">
    <div className="flex shrink-0 justify-end px-4 py-3 sm:px-6 landscape-phone:py-2">
      <Skeleton className="h-9 w-20 rounded-lg" />
    </div>
    <main
      className={cn(
        "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center",
        "justify-center gap-8 px-4 pb-16 text-center",
        "landscape-phone:max-w-3xl landscape-phone:gap-4",
        "landscape-phone:px-6 landscape-phone:pb-4",
      )}
    >
      <header
        className={cn(
          "w-full py-6 px-4 flex flex-col items-center",
          "landscape-phone:py-0",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center gap-4 mb-4",
            "landscape-phone:mb-2 landscape-phone:gap-2",
          )}
        >
          <Skeleton className="size-[70px] rounded-2xl landscape-phone:size-10" />
          <Skeleton
            className={cn(
              "h-16 w-80 md:w-[480px] rounded-xl",
              "landscape-phone:h-9 landscape-phone:w-48",
            )}
          />
        </div>
        <Skeleton
          className={cn(
            "h-6 w-64 md:w-[540px] mb-8",
            "landscape-phone:mb-0 landscape-phone:h-4 landscape-phone:w-56",
          )}
        />
      </header>
      <LandingFormLoading />
    </main>
  </div>
);

export default LandingLoading;

export const LandingFormLoading: FC = () => (
  <div
    className={cn(
      "flex flex-col items-center gap-4 w-full max-w-80",
      "landscape-phone:max-w-3xl landscape-phone:gap-3",
    )}
  >
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
