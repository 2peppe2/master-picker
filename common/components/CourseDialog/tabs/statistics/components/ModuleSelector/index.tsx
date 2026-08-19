"use client";

import { usePrefersSheet } from "@/common/hooks/useResponsiveLayout";
import ModuleSelectorSmall from "./ModuleSelectorSmall";
import ModuleSelectorLarge from "./ModuleSelectorLarge";
import { ModuleSelectorProps } from "./types";
import { FC } from "react";

const ModuleSelector: FC<ModuleSelectorProps> = (props) => {
  const prefersSheet = usePrefersSheet();

  return prefersSheet ? (
    <ModuleSelectorSmall {...props} />
  ) : (
    <ModuleSelectorLarge {...props} />
  );
};

export default ModuleSelector;
