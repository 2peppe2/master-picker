import DraggedCourseCard from "./DraggedCourseCard";
import DefaultCourseCard from "./DefaultCourseCard";
import GhostCourseCard from "./GhostCourseCard";
import { Course } from "@/app/dashboard/page";
import { FC, memo } from "react";

export type CourseCardVariant = "default" | "dropped" | "dragged" | "ghost";

interface CourseCardWrapperProps {
  variant: CourseCardVariant;
  course: Course;
}

export interface CourseCardProps {
  course: Course;
}

const CARD_VARIANTS: Record<CourseCardVariant, FC<CourseCardProps>> = {
  dropped: (props) => <DefaultCourseCard dropped={true} {...props} />,
  default: (props) => <DefaultCourseCard dropped={false} {...props} />,
  dragged: DraggedCourseCard,
  ghost: GhostCourseCard,
};

const CourseCard = memo<CourseCardWrapperProps>(
  ({ course, variant }) => {
    const Component = CARD_VARIANTS[variant];

    return <Component course={course} />;
  },
  (prev, next) => {
    return (
      prev.variant === next.variant && prev.course.code === next.course.code
    );
  },
);

CourseCard.displayName = "CourseCard";

export default CourseCard;
