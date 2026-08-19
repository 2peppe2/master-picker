"use client";

import MasterOverflowRowLarge from "./MasterOverflowRowLarge";
import MasterOverflowRowSmall from "./MasterOverflowRowSmall";
import { MasterOverflowRowProps } from "./MasterOverflowRow.types";
import {
  useIsLandscapePhone,
  usePrefersTapDisclosure,
} from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

const MasterOverflowRow: FC<MasterOverflowRowProps> = (props) => {
  const prefersTapDisclosure = usePrefersTapDisclosure();
  const isLandscapePhone = useIsLandscapePhone();

  return prefersTapDisclosure ? (
    <MasterOverflowRowSmall {...props} sideSheet={isLandscapePhone} />
  ) : (
    <MasterOverflowRowLarge {...props} />
  );
};

export default MasterOverflowRow;
