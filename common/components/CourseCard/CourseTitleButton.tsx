"use client";

import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { useCourseTranslate } from "@/common/components/translate/hooks/useCourseTranslate";
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
      className="min-w-0 max-w-[calc(100%-1rem)] text-left text-sm font-medium text-muted-foreground [overflow-wrap:anywhere]"
      style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden",
      }}
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
