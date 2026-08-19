import BachelorYearSettings from "./BachelorYearSettings";
import ScheduleLayoutOptions from "./ScheduleLayoutOptions";
import { SectionHeader } from "./SettingsRows";
import Translate from "@/common/components/translate/Translate";
import LanguageOptions from "./LanguageOptions";
import { FC, Suspense } from "react";

const SettingsPhoneContent: FC = () => (
  <>
    <BachelorYearSettings phone />
    <SectionHeader phone>
      <Translate text="_schedule_layout" />
    </SectionHeader>
    <ScheduleLayoutOptions />
    <SectionHeader phone>
      <Translate text="language_settings" />
    </SectionHeader>
    <Suspense fallback={<div className="min-h-24" />}>
      <LanguageOptions />
    </Suspense>
  </>
);

export default SettingsPhoneContent;
