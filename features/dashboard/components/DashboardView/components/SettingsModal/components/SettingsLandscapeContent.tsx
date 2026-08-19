import BachelorYearSettings from "./BachelorYearSettings";
import { SectionHeader } from "./SettingsRows";
import Translate from "@/common/components/translate/Translate";
import LanguageOptions from "./LanguageOptions";
import { FC, Suspense } from "react";

const SettingsLandscapeContent: FC = () => (
  <>
    <BachelorYearSettings phone />
    <SectionHeader phone>
      <Translate text="language_settings" />
    </SectionHeader>
    <Suspense fallback={<div className="min-h-24" />}>
      <LanguageOptions />
    </Suspense>
  </>
);

export default SettingsLandscapeContent;
