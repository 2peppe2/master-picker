"use client";

import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import SettingsLandscape from "./components/SettingsLandscape";
import SettingsSmall from "./components/SettingsSmall";
import SettingsLarge from "./components/SettingsLarge";
import { SettingsViewProps } from "./types";
import { FC } from "react";

const SettingsModal: FC<SettingsViewProps> = (props) => {
  const prefersSheet = usePrefersSheet();
  const isLandscapePhone = useIsLandscapePhone();

  if (isLandscapePhone) {
    return <SettingsLandscape {...props} />;
  }

  return prefersSheet ? (
    <SettingsSmall {...props} />
  ) : (
    <SettingsLarge {...props} />
  );
};

export default SettingsModal;
