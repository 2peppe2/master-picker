"use client";

import SelectableCourseCard, {
  SelectableCourseCardProps,
} from "./SelectableCourseCard";
import GrabbableCourseCard from "./GrabbableCourseCard";
import DefaultCourseCard from "./DefaultCourseCard";
import DroppedCourseCard from "./DroppedCourseCard";
import DraggedCourseCard from "./DraggedCourseCard";
import CustomCourseCard from "./CustomCourseCard";
import GhostCourseCard from "./GhostCourseCard";
import { memo, ComponentType } from "react";
import { Course } from "@/app/dashboard/page";

export type CourseCardVariant =
  | "default"
  | "dropped"
  | "dragged"
  | "ghost"
  | "selectable"
  | "grabbable";

export interface CourseCardProps {
  course: Course;
}

type CourseCardWrapperProps =
  | ({ variant: "selectable" } & SelectableCourseCardProps)
  | ({ variant: "default" } & CourseCardProps)
  | ({ variant: "dropped" } & CourseCardProps)
  | ({ variant: "dragged" } & CourseCardProps)
  | ({ variant: "ghost" } & CourseCardProps)
  | ({ variant: "grabbable" } & CourseCardProps);

const VARIANTS: {
  [K in CourseCardVariant]: ComponentType<
    Extract<CourseCardWrapperProps, { variant: K }>
  >;
} = {
  default: DefaultCourseCard,
  dropped: DroppedCourseCard,
  grabbable: GrabbableCourseCard,
  dragged: DraggedCourseCard,
  ghost: GhostCourseCard,
  selectable: SelectableCourseCard,
};

const CourseCard = memo<CourseCardWrapperProps>(
  (props) => {
    if (props.course.code.startsWith("custom_")) {
      return <CustomCourseCard variant={props.variant} course={props.course} />;
    }

    const Component = VARIANTS[
      props.variant
    ] as ComponentType<CourseCardWrapperProps>;

    return <Component {...props} />;
  },
  (prev, next) => {
    const isSameBase =
      prev.variant === next.variant && prev.course.code === next.course.code;

    if (prev.variant === "selectable" && next.variant === "selectable") {
      return isSameBase && prev.isSelected === next.isSelected;
    }

    return isSameBase;
  },
);

CourseCard.displayName = "CourseCard";

export default CourseCard;
