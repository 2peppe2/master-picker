import { ProcessedMaster } from "../types";
import { useMemo } from "react";

interface UseBadgeOverflowArgs {
  barWidth: number;
  badgeWidth: number;
  gap: number;
  masters: ProcessedMaster[];
}

export const useBadgeOverflow = ({
  barWidth,
  badgeWidth,
  gap,
  masters,
}: UseBadgeOverflowArgs) => {
  return useMemo(() => {
    if (!barWidth || !badgeWidth || masters.length === 0) {
      return { visibleItems: masters, overflowItems: [] };
    }

    const itemUnit = badgeWidth + gap;
    const totalSlots = Math.floor((barWidth + gap) / itemUnit);

    if (masters.length <= totalSlots) {
      return { visibleItems: masters, overflowItems: [] };
    }

    const showCount = Math.max(1, totalSlots - 1);
    return {
      visibleItems: masters.slice(0, showCount),
      overflowItems: masters.slice(showCount),
    };
  }, [masters, barWidth, badgeWidth, gap]);
};
