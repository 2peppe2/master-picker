"use client";

import type { Course } from "@/common/types";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourseCardFooter from "./CourseCardFooter";
import CourseTitleButton from "./CourseTitleButton";
import { COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE } from "./interactionBarrier";

interface CourseCardPresentationProps {
  course: Course;
  onOpen?: () => void;
  draggable?: boolean;
  inert?: boolean;
}

/** The shared visual core used by both resting cards and the drag overlay. */
const CourseCardPresentation = ({
  course,
  onOpen,
  draggable = false,
  inert = false,
}: CourseCardPresentationProps) => (
  <>
    <CardHeader className="min-w-0 gap-2 px-5">
      <CardTitle>
        {inert ? (
          <span
            data-slot="course-card-code"
            className="text-left text-base font-bold text-primary"
          >
            {course.code}
          </span>
        ) : (
          <Button
            type="button"
            variant="link"
            data-slot="course-card-code"
            data-no-drag={draggable ? "true" : undefined}
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.();
            }}
            className="h-auto p-0 text-left text-base font-bold"
          >
            {course.code}
          </Button>
        )}
      </CardTitle>

      <CardDescription
        {...{ [COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE]: "" }}
        onClick={(event) => event.stopPropagation()}
        className="m-0 min-h-10 min-w-0 p-0"
      >
        <CourseTitleButton
          title={course.name}
          draggable={draggable}
          inert={inert}
          onOpen={onOpen}
        />
      </CardDescription>
    </CardHeader>

    <CourseCardFooter className="px-5" masterPrograms={course.CourseMaster} />
  </>
);

export default CourseCardPresentation;
