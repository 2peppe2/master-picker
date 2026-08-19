import LandscapeSideSheet from "@/common/components/LandscapeSideSheet";
import Translate from "@/common/components/translate/Translate";
import SettingsTriggerButton from "./SettingsTriggerButton";
import SettingsLandscapeContent from "./SettingsLandscapeContent";
import { SettingsViewProps } from "../types";
import { FC } from "react";

const SettingsLandscape: FC<SettingsViewProps> = ({
  isOpen,
  onOpenChange,
}) => (
  <LandscapeSideSheet
    open={isOpen}
    onOpenChange={onOpenChange}
    trigger={<SettingsTriggerButton isOpen={isOpen} />}
    title={<Translate text="settings" />}
  >
    <SettingsLandscapeContent />
  </LandscapeSideSheet>
);

export default SettingsLandscape;
