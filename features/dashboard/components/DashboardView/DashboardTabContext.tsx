"use client";

import { createContext, FC, ReactNode, useContext } from "react";
import type { DashboardTab } from ".";

interface DashboardTabContextValue {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const DashboardTabContext = createContext<DashboardTabContextValue | null>(
  null,
);

interface DashboardTabProviderProps extends DashboardTabContextValue {
  children: ReactNode;
}

export const DashboardTabProvider: FC<DashboardTabProviderProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => (
  <DashboardTabContext value={{ activeTab, setActiveTab }}>
    {children}
  </DashboardTabContext>
);

export const useDashboardTabs = () => {
  const value = useContext(DashboardTabContext);

  if (!value) {
    throw new Error(
      "useDashboardTabs must be used within DashboardTabProvider",
    );
  }

  return value;
};
