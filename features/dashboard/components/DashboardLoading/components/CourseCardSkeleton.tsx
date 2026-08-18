import { Skeleton } from "@/components/ui/skeleton";
import type { FC } from "react";

interface CourseCardSkeletonProps {
  layout?: "desktop" | "landscape";
}

const layoutClassNames: Record<NonNullable<CourseCardSkeletonProps["layout"]>, string> = {
  desktop: "h-40 rounded-xl",
  landscape: "aspect-square w-full rounded-lg",
};

const CourseCardSkeleton: FC<CourseCardSkeletonProps> = ({
  layout = "desktop",
}) => (
  <Skeleton className={layoutClassNames[layout]} />
);

export default CourseCardSkeleton;
