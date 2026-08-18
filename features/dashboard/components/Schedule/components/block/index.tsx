"use client";

import { slotAtom } from "@/features/dashboard/state/schedule/atoms";
import { Slot } from "@/features/dashboard/state/schedule/types";
import { useAtomValue } from "jotai";
import StandardBlock from "./StandardBlock";
import WildcardBlock from "./WildcardBlock";
import GhostBlock from "./GhostBlock";
import { createElement, FC } from "react";

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
  const courseSlot = useAtomValue(
    slotAtom(data.semesterNumber, data.periodNumber, data.blockNumber),
  );

  return createElement(BLOCK_VARIANTS[variant], { courseSlot, data });
};

export default Block;
