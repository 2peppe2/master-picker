"use client";

import { useBlockCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import {
  useIsLandscapePhone,
  usePrefersSheet,
} from "@/common/hooks/useResponsiveLayout";
import SemesterSettingsLandscape from "./SemesterSettingsLandscape";
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

  const handleAddBlock = useCallback(() => {
    addBlockToSemester(semester);
    onOpenChange(false);
  }, [addBlockToSemester, semester, onOpenChange]);

  if (isLandscapePhone) {
    return (
      <SemesterSettingsLandscape
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAddBlock={handleAddBlock}
      />
    );
  }

  return prefersSheet ? (
    <SemesterSettingsSmall
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onAddBlock={handleAddBlock}
    />
  ) : (
    <SemesterSettingsLarge
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onAddBlock={handleAddBlock}
    />
  );
};

export default SemesterSettingsModal;
