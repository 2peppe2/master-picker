"use client";

import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import LandscapeSideSheet from "@/common/components/LandscapeSideSheet";
import Translate from "@/common/components/translate/Translate";
import SettingsTriggerButton from "./components/SettingsTriggerButton";
import SettingsContent from "./components/SettingsContent";
import SettingsSmall from "./components/SettingsSmall";
import SettingsLarge from "./components/SettingsLarge";
import { SettingsViewProps } from "./types";
import { FC } from "react";

const SettingsModal: FC<SettingsViewProps> = (props) => {
  const prefersSheet = usePrefersSheet();
  const isLandscapePhone = useIsLandscapePhone();

  if (isLandscapePhone) {
    return (
      <LandscapeSideSheet
        open={props.isOpen}
        onOpenChange={props.onOpenChange}
        trigger={<SettingsTriggerButton isOpen={props.isOpen} />}
        title={<Translate text="settings" />}
      >
        <SettingsContent phone />
      </LandscapeSideSheet>
    );
  }

  return prefersSheet ? (
    <SettingsSmall {...props} />
  ) : (
    <SettingsLarge {...props} />
  );
};

export default SettingsModal;
