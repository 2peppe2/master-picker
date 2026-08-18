"use client";

import MasterOverflowRowLarge from "./MasterOverflowRowLarge";
import MasterOverflowRowSmall from "./MasterOverflowRowSmall";
import { MasterOverflowRowProps } from "./MasterOverflowRow.types";
import { usePrefersTapDisclosure } from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

const MasterOverflowRow: FC<MasterOverflowRowProps> = (props) => {
  const prefersTapDisclosure = usePrefersTapDisclosure();

  return prefersTapDisclosure ? (
    <MasterOverflowRowSmall {...props} />
  ) : (
    <MasterOverflowRowLarge {...props} />
  );
};

export default MasterOverflowRow;
