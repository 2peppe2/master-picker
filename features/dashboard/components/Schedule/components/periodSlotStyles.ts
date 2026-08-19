import { cn } from "@/lib/utils";

export const slotSizeClasses = (carousel: boolean) =>
  cn(
    carousel
      ? "size-40 shrink-0 snap-start"
      : "mx-auto size-auto aspect-square w-full min-w-0 shrink",
    "sm:mx-auto sm:size-auto sm:aspect-square sm:w-full sm:min-w-0 sm:shrink",
    "lg:mx-0 lg:h-40 lg:w-40 lg:shrink-0",
  );
