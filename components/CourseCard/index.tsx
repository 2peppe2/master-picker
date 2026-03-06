"use client";

import { memo, ComponentType } from "react";
import { Course } from "@/app/dashboard/page";

import DefaultCourseCard from "./DefaultCourseCard";
import DroppedCourseCard from "./DroppedCourseCard";
import DraggedCourseCard from "./DraggedCourseCard";
import GhostCourseCard from "./GhostCourseCard";
import GrabbableCourseCard from "./GrabbableCourseCard";
import SelectableCourseCard, {
  SelectableCourseCardProps,
} from "./SelectableCourseCard";

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
