"use client";

import MasterProgressBadgeLarge from "./MasterProgressBadgeLarge";
import MasterProgressBadgeSmall from "./MasterProgressBadgeSmall";
import { MasterProgressBadgeProps } from "./MasterProgressBadge.types";
import { usePrefersTapDisclosure } from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

const MasterProgressBadge: FC<MasterProgressBadgeProps> = (props) => {
  const prefersTapDisclosure = usePrefersTapDisclosure();

  return prefersTapDisclosure ? (
    <MasterProgressBadgeSmall {...props} />
  ) : (
    <MasterProgressBadgeLarge {...props} />
  );
};

export default MasterProgressBadge;
