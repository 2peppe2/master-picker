import LandscapeSideSheet from "@/common/components/LandscapeSideSheet";
import Translate from "@/common/components/translate/Translate";
import CalendarTriggerButton from "./components/CalendarTriggerButton";
import CalendarRows from "./components/CalendarRows";
import { CalendarViewProps } from "./types";
import { FC } from "react";

const TimeEditSemesterLandscape: FC<CalendarViewProps> = ({
  isOpen,
  onOpenChange,
  links,
  isLoading,
  errorKey,
  hasCourses,
  showAnnouncement,
}) => (
  <LandscapeSideSheet
    open={isOpen}
    onOpenChange={onOpenChange}
    trigger={
      <CalendarTriggerButton
        hasCourses={hasCourses}
        showAnnouncement={showAnnouncement}
      />
    }
    title={<Translate text="_calendar_subscribe_title" />}
    description={<Translate text="_calendar_replan_hint" />}
  >
    <div className="flex flex-col gap-2">
      <CalendarRows links={links} isLoading={isLoading} phone />
      {errorKey && (
        <p className="px-3 pt-1 text-xs text-muted-foreground">
          <Translate text={errorKey} />
        </p>
      )}
    </div>
  </LandscapeSideSheet>
);

export default TimeEditSemesterLandscape;
