"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { Course } from "@/common/types";
import { FC } from "react";

interface ConflictListProps {
  collisions: Course[];
}

const ConflictList: FC<ConflictListProps> = ({ collisions }) => (
  <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
    <ul className="list-disc space-y-1 pl-4">
      {collisions.map((course) => (
        <li key={course.code}>
          <span className="font-semibold">{course.code}</span> -{" "}
          <CourseTranslate text={course.name} />
        </li>
      ))}
    </ul>
  </div>
);

export default ConflictList;
