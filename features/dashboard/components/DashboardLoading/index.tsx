"use client";

import DashboardLoadingCompact from "./components/DashboardLoadingCompact";
import DashboardLoadingDesktop from "./components/DashboardLoadingDesktop";
import DashboardLoadingLandscape from "./components/DashboardLoadingLandscape";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import type { FC } from "react";

const DashboardLoading: FC = () => {
  const translate = useCommonTranslate();

  return (
    <div
      data-dashboard-loading="true"
      role="status"
      aria-busy="true"
      aria-label={translate("_loading_dashboard")}
      className="h-[100dvh] w-full overflow-hidden"
    >
      <DashboardLoadingCompact />
      <DashboardLoadingDesktop />
      <DashboardLoadingLandscape />
      <span className="sr-only">{translate("_loading_dashboard")}</span>
    </div>
  );
};

export default DashboardLoading;
