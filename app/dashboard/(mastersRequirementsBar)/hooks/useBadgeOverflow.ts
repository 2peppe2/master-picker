import { ProcessedMaster } from "../types";
import { useMemo } from "react";

interface UseBadgeOverflowArgs {
  barWidth: number;
  badgeWidth: number;
  gap: number;
  items: ProcessedMaster[];
}

export const useBadgeOverflow = ({
  barWidth,
  badgeWidth,
  gap,
  items,
}: UseBadgeOverflowArgs) => {
  return useMemo(() => {
    if (!barWidth || !badgeWidth || items.length === 0) {
      return { visibleItems: items, overflowItems: [] };
    }

    const itemUnit = badgeWidth + gap;
    const totalSlots = Math.floor((barWidth + gap) / itemUnit);

    if (items.length <= totalSlots) {
      return { visibleItems: items, overflowItems: [] };
    }

    const showCount = Math.max(1, totalSlots - 1);
    return {
      visibleItems: items.slice(0, showCount),
      overflowItems: items.slice(showCount),
    };
  }, [items, barWidth, badgeWidth, gap]);
};
