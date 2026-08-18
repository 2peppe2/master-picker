import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

const LandingSelectorLoading: FC = () => (
  <Skeleton className="h-12 w-full rounded-lg" />
);

export default LandingSelectorLoading;
