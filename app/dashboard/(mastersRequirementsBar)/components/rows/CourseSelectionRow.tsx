"use client";

import { CourseRequirement } from "@/app/dashboard/page";
import { FC } from "react";

const NUM_TO_TYPED: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
};

interface CourseSelectionRowProps {
  requirement: CourseRequirement;
}

const CourseSelectionRow: FC<CourseSelectionRowProps> = ({ requirement }) => {
  const isMandatory =
    requirement.minCount === 1 && requirement.courses.length === 1;

  const listFormatter = new Intl.ListFormat("en", {
    style: "narrow",
    type: "disjunction",
  });

  const courseList = listFormatter.format(
    requirement.courses.map((c) => c.courseCode),
  );

  return (
    <span className="leading-snug">
      {isMandatory
        ? "Complete "
        : `Complete ${NUM_TO_TYPED[requirement.minCount] || requirement.minCount} of `}
      <b className="text-foreground font-semibold">{courseList}</b>.
    </span>
  );
};

export default CourseSelectionRow;
