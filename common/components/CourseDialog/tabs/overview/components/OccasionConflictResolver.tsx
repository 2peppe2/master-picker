import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import { Course, CourseOccasion } from "@/common/types";
import { FC } from "react";

interface OccasionConflictResolverProps {
  course: Course;
  occasion: CourseOccasion | null;
  collisions: Course[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OccasionConflictResolver: FC<OccasionConflictResolverProps> = ({
  course,
  occasion,
  collisions,
  open,
  onOpenChange,
}) => {
  if (!occasion) return null;

  return (
    <ConflictResolverModal
      open={open}
      setOpen={onOpenChange}
      conflictData={{
        strategy: "button",
        collisions,
        course,
        occasion,
      }}
    />
  );
};

export default OccasionConflictResolver;
