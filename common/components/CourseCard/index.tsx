"use client";

import { memo, type FC } from "react";
import { Course } from "@/common/types";

import DefaultCourseCard from "./DefaultCourseCard";
import SelectableCourseCard, {
  SelectableCourseCardProps,
} from "./SelectableCourseCard";

export interface CourseCardProps {
  course: Course;
}

type CourseCardWrapperProps =
  | ({ variant: "selectable" } & SelectableCourseCardProps)
  | ({ variant: "default" } & CourseCardProps);

const CourseCardComponent: FC<CourseCardWrapperProps> = (props) => {
  switch (props.variant) {
    case "default":
      return <DefaultCourseCard course={props.course} />;
    case "selectable":
      return <SelectableCourseCard {...props} />;
  }
};

const CourseCard = memo(CourseCardComponent);

CourseCard.displayName = "CourseCard";

export default CourseCard;
