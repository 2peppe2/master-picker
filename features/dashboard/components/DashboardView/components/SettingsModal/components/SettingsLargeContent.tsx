import BachelorYearSettings from "./BachelorYearSettings";
import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import { SectionHeader } from "./SettingsRows";
import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

const SettingsLargeContent: FC = () => (
  <>
    <BachelorYearSettings />
    <div className="block lg:hidden">
      <SectionHeader phone={false}>
        <Translate text="language_settings" />
      </SectionHeader>
      <div className="flex flex-col gap-3 px-4 py-3">
        <LanguageSwitcher />
      </div>
    </div>
  </>
);

export default SettingsLargeContent;
