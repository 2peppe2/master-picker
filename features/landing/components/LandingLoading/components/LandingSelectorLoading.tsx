import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const LandingSelectorLoading: FC = () => (
  <Skeleton className="h-11 w-full rounded-lg sm:h-12 landscape-phone:h-10" />
);

export default LandingSelectorLoading;
