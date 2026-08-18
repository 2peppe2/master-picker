"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import { Calendar, Search } from "lucide-react";
import { DashboardTab } from "../index";
import { FC, KeyboardEvent } from "react";
import { useDashboardTabs } from "../DashboardTabContext";

const tabs: DashboardTab[] = ["schedule", "search"];

const getNextTab = (key: string, currentIndex: number) => {
  if (key === "ArrowRight" || key === "ArrowDown") {
    return tabs[(currentIndex + 1) % tabs.length];
  }

  if (key === "ArrowLeft" || key === "ArrowUp") {
    return tabs[(currentIndex - 1 + tabs.length) % tabs.length];
  }

  if (key === "Home") return tabs[0];

  if (key === "End") return tabs[tabs.length - 1];
  return null;
};

const MobileTabs: FC = () => {
  const translate = useCommonTranslate();
  const { activeTab, setActiveTab } = useDashboardTabs();
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextTab = getNextTab(event.key, currentIndex);

    if (!nextTab) return;

    event.preventDefault();
    setActiveTab(nextTab);
    document.getElementById(`dashboard-${nextTab}-tab`)?.focus();
  };

  return (
    <nav
      aria-label={translate("_dashboard_views")}
      className={cn(
        "relative z-50 shrink-0 overflow-hidden rounded-t-2xl",
        "border-x border-t border-border/60 bg-background/95",
        "px-3 pb-[calc(0.25rem+env(safe-area-inset-bottom))]",
        "pt-1 backdrop-blur-xl",
      )}
    >
      <div role="tablist" className="mx-auto grid w-full max-w-sm grid-cols-2">
        <button
          type="button"
          id="dashboard-schedule-tab"
          role="tab"
          aria-controls="dashboard-schedule-panel"
          aria-selected={activeTab === "schedule"}
          onClick={() => setActiveTab("schedule")}
          onKeyDown={handleKeyDown}
          className={`flex min-h-(--touch) flex-col items-center justify-center gap-0 rounded-xl px-3 py-0.5 text-2xs font-medium transition-colors landscape-phone:flex-row landscape-phone:gap-1.5 ${
            activeTab === "schedule"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span
            className={`flex h-6 w-10 items-center justify-center rounded-full transition-colors landscape-phone:h-auto landscape-phone:w-auto ${
              activeTab === "schedule" ? "bg-primary/12" : "bg-transparent"
            }`}
          >
            <Calendar className="size-4" />
          </span>
          <Translate text="dashboard_schedule" />
        </button>

        <button
          type="button"
          id="dashboard-search-tab"
          role="tab"
          aria-controls="dashboard-search-panel"
          aria-selected={activeTab === "search"}
          onClick={() => setActiveTab("search")}
          onKeyDown={handleKeyDown}
          className={`flex min-h-(--touch) flex-col items-center justify-center gap-0 rounded-xl px-3 py-0.5 text-2xs font-medium transition-colors landscape-phone:flex-row landscape-phone:gap-1.5 ${
            activeTab === "search"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span
            className={`flex h-6 w-10 items-center justify-center rounded-full transition-colors landscape-phone:h-auto landscape-phone:w-auto ${
              activeTab === "search" ? "bg-primary/12" : "bg-transparent"
            }`}
          >
            <Search className="size-4" />
          </span>
          <Translate text="dashboard_search" />
        </button>
      </div>
    </nav>
  );
};

export default MobileTabs;
