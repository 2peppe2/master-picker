import { useMeasure } from "react-use";
import type { ProcessedMaster } from "../types";
import { useBadgeOverflow } from "./useBadgeOverflow";

interface UseMasterOverflowLayoutArgs {
  gap: number;
  masters: ProcessedMaster[];
}

export const useMasterOverflowLayout = ({
  gap,
  masters,
}: UseMasterOverflowLayoutArgs) => {
  const [barRef, { width: barWidth }] = useMeasure<HTMLDivElement>();
  const [badgeRef, { width: badgeWidth }] = useMeasure<HTMLDivElement>();
  const items = useBadgeOverflow({
    barWidth,
    badgeWidth,
    gap,
    masters,
  });

  return { barRef, badgeRef, badgeWidth, ...items };
};
