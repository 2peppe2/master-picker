"use client";

import Translate from "@/common/components/translate/Translate";
import { Calendar, Search } from "lucide-react";
import { DashboardTab } from "../index";
import { FC } from "react";

interface MobileTabsProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const MobileTabs: FC<MobileTabsProps> = ({ activeTab, setActiveTab }) => (
  <div className="flex items-center justify-center bg-background/80 backdrop-blur-lg border-t border-border/50 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] gap-1 relative z-50">
    <div className="flex w-full max-w-md bg-muted/40 dark:bg-zinc-950/40 rounded-xl p-1 gap-1 relative border border-transparent dark:border-white/5">
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card dark:bg-zinc-800 rounded-lg shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out border border-transparent dark:border-white/10"
        style={{
          transform: `translateX(${activeTab === "search" ? "calc(100% + 4px)" : "0"})`,
        }}
      />

      <button
        onClick={() => setActiveTab("schedule")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10 ${
          activeTab === "schedule"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Calendar className="w-4 h-4" />
        <Translate text="_dashboard_schedule" />
      </button>

      <button
        onClick={() => setActiveTab("search")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-colors relative z-10 ${
          activeTab === "search"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Search className="w-4 h-4" />
        <Translate text="_dashboard_search" />
      </button>
    </div>
  </div>
);

export default MobileTabs;
