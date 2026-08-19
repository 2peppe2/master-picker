"use client";

import type { Course } from "@/common/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FC } from "react";
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

const CourseCardPresentation: FC<CourseCardPresentationProps> = ({
  course,
  onOpen,
  draggable = false,
  inert = false,
}) => (
  <>
    {/* Landscape tiles are ~100px square, so the inline padding and the row
        gap both have to give. The add button's clearance is a max-width on the
        code line alone -- as padding it left the code's box under the button,
        which then swallowed taps meant for the title. */}
    <CardHeader
      className={cn(
        "min-w-0 gap-2 px-5",
        "landscape-phone:gap-1.5 landscape-phone:px-3 landscape-phone:pt-1.5",
      )}
    >
      <CardTitle>
        {inert ? (
          <span
            data-slot="course-card-code"
            className="text-left text-base font-bold text-primary landscape-phone:max-w-[calc(100%-2.25rem)]"
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
            // Absolute rem, not a --spacing multiple: this reserves room for
            // the floating add button and must not shrink with the scale.
            className="h-auto p-0 text-left text-base font-bold landscape-phone:max-w-[calc(100%-2.25rem)]"
          >
            {course.code}
          </Button>
        )}
      </CardTitle>

      <CardDescription
        {...{ [COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE]: "" }}
        onClick={(event) => event.stopPropagation()}
        // min-h-10 is 32px under the landscape scale, which alone overruns a
        // ~100px tile; the title's own min-h handles line reservation there.
        className="m-0 min-h-10 min-w-0 p-0 landscape-phone:min-h-0"
      >
        <CourseTitleButton
          title={course.name}
          draggable={draggable}
          inert={inert}
          onOpen={onOpen}
        />
      </CardDescription>
    </CardHeader>

    <CourseCardFooter
      className="px-5 landscape-phone:px-3"
      masterPrograms={course.CourseMaster}
    />
  </>
);

export default CourseCardPresentation;
