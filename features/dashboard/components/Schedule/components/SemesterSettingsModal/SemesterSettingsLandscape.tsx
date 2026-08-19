"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import LandscapeSideSheet from "@/common/components/LandscapeSideSheet";
import Translate from "@/common/components/translate/Translate";
import SettingsTriggerButton from "./components/SettingsTriggerButton";
import AddBlockRow from "./components/AddBlockRow";
import { SemesterSettingsViewProps } from "./types";
import { FC } from "react";

const SemesterSettingsLandscape: FC<SemesterSettingsViewProps> = ({
  isOpen,
  onOpenChange,
  onAddBlock,
}) => {
  const translate = useCommonTranslate();

  return (
    <LandscapeSideSheet
      open={isOpen}
      onOpenChange={onOpenChange}
      trigger={
        <SettingsTriggerButton label={translate("_semester_settings")} />
      }
      title={<Translate text="_semester_settings" />}
    >
      <AddBlockRow onClick={onAddBlock} phone />
    </LandscapeSideSheet>
  );
};

export default SemesterSettingsLandscape;
