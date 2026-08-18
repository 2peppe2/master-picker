"use client";

import { useBlockCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import LandscapeSideSheet from "@/common/components/LandscapeSideSheet";
import Translate from "@/common/components/translate/Translate";
import SettingsTriggerButton from "./components/SettingsTriggerButton";
import AddBlockRow from "./components/AddBlockRow";
import SemesterSettingsSmall from "./SemesterSettingsSmall";
import SemesterSettingsLarge from "./SemesterSettingsLarge";
import { SemesterSettingsModalProps } from "./types";
import { FC, useCallback } from "react";

const SemesterSettingsModal: FC<SemesterSettingsModalProps> = ({
  semester,
  isOpen,
  onOpenChange,
}) => {
  const { addBlockToSemester } = useBlockCommands();
  const prefersSheet = usePrefersSheet();
  const isLandscapePhone = useIsLandscapePhone();
  const translate = useCommonTranslate();

  const handleAddBlock = useCallback(() => {
    addBlockToSemester(semester);
    onOpenChange(false);
  }, [addBlockToSemester, semester, onOpenChange]);

  if (isLandscapePhone) {
    return (
      <LandscapeSideSheet
        open={isOpen}
        onOpenChange={onOpenChange}
        trigger={
          <SettingsTriggerButton label={translate("_semester_settings")} />
        }
        title={<Translate text="_semester_settings" />}
      >
        <AddBlockRow onClick={handleAddBlock} phone />
      </LandscapeSideSheet>
    );
  }

  const Presentation = prefersSheet
    ? SemesterSettingsSmall
    : SemesterSettingsLarge;

  return (
    <Presentation
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onAddBlock={handleAddBlock}
    />
  );
};

export default SemesterSettingsModal;
