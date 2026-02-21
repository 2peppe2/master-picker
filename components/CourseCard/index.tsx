import DraggedCourseCard from "./DraggedCourseCard";
import DefaultCourseCard from "./DefaultCourseCard";
import GhostCourseCard from "./GhostCourseCard";
import { Course } from "@/app/dashboard/page";
import { FC, memo } from "react";
import SelectableCourseCard from "./SelectableCourseCard";

export type CourseCardVariant = "default" | "dropped" | "dragged" | "ghost" | "selectable";

interface CourseCardWrapperProps {
  variant: CourseCardVariant;
  course: Course;
  props?: any;
}

export interface CourseCardProps {
  course: Course;
}

const VARIANTS: Record<CourseCardVariant, FC<CourseCardProps>> = {
  dropped: (props) => <DefaultCourseCard dropped={true} {...props} />,
  default: (props) => <DefaultCourseCard dropped={false} {...props} />,
  dragged: DraggedCourseCard,
  ghost: GhostCourseCard,
  selectable: SelectableCourseCard,
};

const CourseCard = memo<CourseCardWrapperProps>(
  ({ course, variant, props }) => {
    const Component = VARIANTS[variant];

    return <Component course={course} {...props} />;
  },
  (prev, next) => {
    return (
      prev.variant === next.variant && prev.course.code === next.course.code
    );
  },
);

CourseCard.displayName = "CourseCard";

export default CourseCard;
