"use client";

import DashboardLandscapeController from "./DashboardLandscapeController";
import DashboardCompactController from "./DashboardCompactController";
import DashboardDesktopController from "./DashboardDesktopController";
import {
  useIsLandscapePhone,
  useLayoutTier,
} from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

export type DashboardTab = "schedule" | "search";

const DashboardView: FC = () => {
  const tier = useLayoutTier();
  const isLandscapePhone = useIsLandscapePhone();

  if (isLandscapePhone) return <DashboardLandscapeController />;

  return tier === "desktop" ? (
    <DashboardDesktopController />
  ) : (
    <DashboardCompactController />
  );
};

export default DashboardView;
