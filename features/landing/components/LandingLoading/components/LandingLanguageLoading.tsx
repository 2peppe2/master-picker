import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const LandingLanguageLoading: FC = () => (
  <div className="flex shrink-0 justify-end px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pe-[calc(1rem+env(safe-area-inset-right))] sm:px-6 landscape-phone:hidden">
    <Skeleton className="h-9 w-20 rounded-lg" />
  </div>
);

export default LandingLanguageLoading;
