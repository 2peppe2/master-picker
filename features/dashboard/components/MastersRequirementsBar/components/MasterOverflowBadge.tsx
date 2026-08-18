"use client";

import MasterOverflowBadgeLarge from "./MasterOverflowBadgeLarge";
import MasterOverflowBadgeSmall from "./MasterOverflowBadgeSmall";
import { MasterOverflowBadgeProps } from "./MasterOverflowBadge.types";
import { usePrefersTapDisclosure } from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

const MasterOverflowBadge: FC<MasterOverflowBadgeProps> = (props) => {
  const prefersTapDisclosure = usePrefersTapDisclosure();

  return prefersTapDisclosure ? (
    <MasterOverflowBadgeSmall {...props} />
  ) : (
    <MasterOverflowBadgeLarge {...props} />
  );
};

export default MasterOverflowBadge;
