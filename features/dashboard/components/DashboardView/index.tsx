"use client";

import DashboardCompactController from "./DashboardCompactController";
import DashboardDesktopController from "./DashboardDesktopController";
import { useIsCompact } from "@/common/hooks/useResponsiveLayout";
import { FC } from "react";

export type DashboardTab = "schedule" | "search";

const DashboardView: FC = () => {
  const isCompact = useIsCompact();

  return isCompact ? (
    <DashboardCompactController />
  ) : (
    <DashboardDesktopController />
  );
};

export default DashboardView;
