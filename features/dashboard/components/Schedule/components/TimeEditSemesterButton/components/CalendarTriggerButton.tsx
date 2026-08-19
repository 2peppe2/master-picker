"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { FC } from "react";

type CalendarTriggerButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  hasCourses: boolean;
  showAnnouncement: boolean;
};

const CalendarTriggerButton: FC<CalendarTriggerButtonProps> = ({
  hasCourses,
  showAnnouncement,
  ...props
}) => {
  const translate = useCommonTranslate();

  return (
    <Button
      {...props}
      variant="ghost"
      size="sm"
      className="relative h-8 gap-2 px-2 hover:bg-accent"
      disabled={!hasCourses}
      title={
        hasCourses
          ? translate("_calendar_subscribe_title")
          : translate("_timeedit_no_courses")
      }
      onClick={(event) => {
        event.stopPropagation();
        props.onClick?.(event);
      }}
    >
      <CalendarDays className="size-4" />
      <span className="hidden xl:inline">
        <Translate text="calendar_button" />
      </span>
      {showAnnouncement && hasCourses && (
        <span className="absolute -right-0.5 -top-0.5 size-2 animate-pulse rounded-full bg-primary" />
      )}
    </Button>
  );
};

export default CalendarTriggerButton;
