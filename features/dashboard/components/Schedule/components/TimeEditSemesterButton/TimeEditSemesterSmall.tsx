"use client";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import CalendarTriggerButton from "./components/CalendarTriggerButton";
import Translate from "@/common/components/translate/Translate";
import CalendarRows from "./components/CalendarRows";
import { Button } from "@/components/ui/button";
import { CalendarViewProps } from "./types";
import { X } from "lucide-react";
import { FC } from "react";

/** Phone presentation: a bottom sheet of calendar destinations. */
const TimeEditSemesterSmall: FC<CalendarViewProps> = ({
  isOpen,
  onOpenChange,
  links,
  isLoading,
  errorKey,
  hasCourses,
  showAnnouncement,
}) => {
  const translate = useCommonTranslate();

  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange}>
      <BottomSheetTrigger asChild>
        <CalendarTriggerButton
          hasCourses={hasCourses}
          showAnnouncement={showAnnouncement}
        />
      </BottomSheetTrigger>

      <BottomSheetContent className="overflow-hidden">
        <div className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-2">
          <div className="min-w-0 flex-1">
            <BottomSheetTitle className="text-lg font-semibold tracking-tight">
              <Translate text="_calendar_subscribe_title" />
            </BottomSheetTitle>
            <BottomSheetDescription className="mt-0.5 text-sm text-muted-foreground">
              <Translate text="_calendar_replan_hint" />
            </BottomSheetDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={translate("close")}
            onClick={() => onOpenChange(false)}
            className="-mr-2 -mt-1 size-10 shrink-0 text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-5 pb-6">
          <CalendarRows links={links} isLoading={isLoading} phone />
          {errorKey && (
            <p className="px-3 pt-1 text-xs text-muted-foreground">
              <Translate text={errorKey} />
            </p>
          )}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default TimeEditSemesterSmall;
