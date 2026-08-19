"use client";

import { useIsTouchLayout } from "@/common/hooks/useResponsiveLayout";
import OccasionTableSmall from "./OccasionTableSmall";
import OccasionTableLarge from "./OccasionTableLarge";
import { OccasionTableProps } from "./OccasionTable.types";
import { FC } from "react";

const OccasionTable: FC<OccasionTableProps> = (props) => {
  const isTouchLayout = useIsTouchLayout();

  return isTouchLayout ? (
    <OccasionTableSmall {...props} />
  ) : (
    <OccasionTableLarge {...props} />
  );
};

export default OccasionTable;
