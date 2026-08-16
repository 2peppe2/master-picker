"use client";

import { cn } from "@/lib/utils";

import UnifiedSearchFilter from "./components/UnifiedSearchFilter";
import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import ShareButton from "./components/ShareButton";
import BackButton from "@/common/components/BackButton";
import CourseResults from "./components/CourseResults";
import type { FC } from "react";

const Drawer: FC = () => {
  return (
    <div
      className={cn(
        "sticky flex h-full w-full shrink-0 flex-col",
        "overflow-hidden sm:pb-1 sm:shadow-sm",
        "lg:w-[var(--dashboard-sidebar-width)]",
        "lg:min-w-[var(--dashboard-sidebar-width)]",
      )}
    >
      <div
        className={cn(
          "z-10 flex shrink-0 flex-col gap-4 px-4 py-4 lg:px-5",
          "lg:py-5",
        )}
      >
        <div className="hidden items-center justify-between gap-2 lg:flex">
          <BackButton
            title="MasterPicker"
            subtitle="_dashboard_header_subtitle"
            returnText="_dashboard_return_to_landing"
            // No flex-1: growing into the row's spare space would make the
            // blank area beside the title hoverable and clickable too.
            className="min-w-0"
          />
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher className="px-3" />
            <ShareButton className="px-3" />
          </div>
        </div>
        <UnifiedSearchFilter />
      </div>

      <CourseResults />
    </div>
  );
};

export default Drawer;
