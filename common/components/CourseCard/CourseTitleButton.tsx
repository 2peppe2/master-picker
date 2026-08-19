"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE } from "./interactionBarrier";

interface CourseTitleButtonProps {
  title: string;
  onOpen?: () => void;
  draggable?: boolean;
  inert?: boolean;
}

const CourseTitleButton: FC<CourseTitleButtonProps> = ({
  title,
  onOpen,
  draggable = false,
  inert = false,
}) => {
  const translate = useCourseTranslate();
  const translatedTitle = translate(title);

  return (
    <div
      data-slot="course-card-title"
      {...{ [COURSE_CARD_INTERACTION_BARRIER_ATTRIBUTE]: "" }}
      onClick={(event) => event.stopPropagation()}
      // min-h-[2lh] reserves both clamped lines so cards stay aligned even when
      // a short title fits on one, which the smaller landscape type exposes.
      //
      // The clamp is a utility rather than an inline style so the landscape
      // override below can win -- an inline style beats a class at any media
      // query, which would have made landscape-phone:line-clamp-1 a no-op.
      className={cn(
        "line-clamp-2 min-h-[2lh] min-w-0 max-w-[calc(100%-1rem)]",
        "text-left text-sm font-medium text-muted-foreground",
        "[overflow-wrap:anywhere]",
        // One line on a ~100px tile, and no reserved gutter: the add button's
        // clearance already lives on the code row above.
        "landscape-phone:line-clamp-1 landscape-phone:min-h-[1lh]",
        "landscape-phone:max-w-full",
      )}
    >
      <span
        data-slot="course-card-title-trigger"
        data-no-drag={draggable && !inert ? "true" : undefined}
        title={translatedTitle}
        onClick={
          inert || !onOpen
            ? undefined
            : (event) => {
                event.stopPropagation();
                onOpen();
              }
        }
        className={
          inert
            ? "[overflow-wrap:anywhere]"
            : "cursor-pointer [overflow-wrap:anywhere] no-underline underline-offset-2 hover:underline focus:no-underline focus-visible:no-underline"
        }
      >
        <CourseTranslate text={title} />
      </span>
    </div>
  );
};

export default CourseTitleButton;
