import { useScheduleGetters } from "@/app/atoms/schedule/hooks/useScheduleGetters";
import { Slot } from "@/app/atoms/schedule/types";
import StandardBlock from "./StandardBlock";
import WildcardBlock from "./WildcardBlock";
import GhostBlock from "./GhostBlock";
import { FC } from "react";

export type BlockVariant = "standard" | "wildcard" | "ghost";

export interface BlockData {
  semesterNumber: number;
  periodNumber: number;
  blockNumber: number;
}

interface BlockWrapperProps {
  data: BlockData;
  variant: BlockVariant;
}

export interface BlockProps {
  data: BlockData;
  courseSlot: Slot;
}

const BLOCK_VARIANTS: Record<BlockVariant, FC<BlockProps>> = {
  standard: StandardBlock,
  wildcard: WildcardBlock,
  ghost: GhostBlock,
};

const Block: FC<BlockWrapperProps> = ({ variant, data }) => {
  const { getSlotCourse } = useScheduleGetters();

  const courseSlot = getSlotCourse({
    semester: data.semesterNumber,
    period: data.periodNumber + 1,
    block: data.blockNumber + 1,
  });

  const Component = BLOCK_VARIANTS[variant];

  return <Component courseSlot={courseSlot} data={data} />;
};

export default Block;
