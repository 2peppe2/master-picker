"use client";

import MasterProgressBadgeLarge from "./MasterProgressBadgeLarge";
import MasterProgressBadgeSmall from "./MasterProgressBadgeSmall";
import { MasterProgressBadgeProps } from "./MasterProgressBadge.types";
import {
  useIsLandscapePhone,
  usePrefersTapDisclosure,
} from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

const MasterProgressBadge: FC<MasterProgressBadgeProps> = (props) => {
  const prefersTapDisclosure = usePrefersTapDisclosure();
  const isLandscapePhone = useIsLandscapePhone();

  return prefersTapDisclosure ? (
    <MasterProgressBadgeSmall {...props} sideSheet={isLandscapePhone} />
  ) : (
    <MasterProgressBadgeLarge {...props} />
  );
};

export default MasterProgressBadge;
