"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CalendarTriggerButton from "./components/CalendarTriggerButton";
import Translate from "@/common/components/translate/Translate";
import CalendarRows from "./components/CalendarRows";
import { CalendarViewProps } from "./types";
import { FC } from "react";

const TimeEditSemesterLarge: FC<CalendarViewProps> = ({
  isOpen,
  onOpenChange,
  links,
  isLoading,
  errorKey,
  hasCourses,
  showAnnouncement,
}) => (
  <Popover open={isOpen} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <CalendarTriggerButton
        hasCourses={hasCourses}
        showAnnouncement={showAnnouncement}
      />
    </PopoverTrigger>

    <PopoverContent
      align="end"
      className="w-80 p-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 pb-2 pt-3">
        <p className="text-sm font-semibold">
          <Translate text="_calendar_subscribe_title" />
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <Translate text="_calendar_replan_hint" />
        </p>
      </div>

      <div className="flex flex-col gap-1 p-2">
        <CalendarRows links={links} isLoading={isLoading} />
      </div>

      {errorKey && (
        <p className="px-4 pb-3 pt-1 text-xs text-muted-foreground">
          <Translate text={errorKey} />
        </p>
      )}
    </PopoverContent>
  </Popover>
);

export default TimeEditSemesterLarge;
