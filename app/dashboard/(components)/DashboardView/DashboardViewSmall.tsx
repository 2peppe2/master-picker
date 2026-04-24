"use client";

import ConflictResolverModal from "@/components/ConflictResolverModal";
import { UseCourseDropHandler } from "./hooks/useCourseDropHandler";
import MobileTabs from "./components/MobileTabs";
import { DashboardViewProps } from "./index";
import { DashboardTab } from "./index";
import Schedule from "../Schedule";
import Drawer from "../Drawer";
import { FC } from "react";

interface DashboardViewSmallProps extends DashboardViewProps {
  dropHandler: UseCourseDropHandler;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const DashboardViewSmall: FC<DashboardViewSmallProps> = ({
  courses,
  dropHandler,
  activeTab,
  setActiveTab,
}) => (
  <>
    <div className="flex-1 flex flex-col relative items-start w-full overflow-hidden">
      {dropHandler.conflictOpen && dropHandler.conflictData && (
        <ConflictResolverModal
          open={dropHandler.conflictOpen}
          setOpen={dropHandler.setConflictOpen}
          conflictData={dropHandler.conflictData}
        />
      )}

      <div
        className="flex h-full w-[200%] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          transform: `translateX(${activeTab === "schedule" ? "0%" : "-50%"})`,
        }}
      >
        <div className="w-1/2 h-full flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth flex flex-col gap-3">
            <Schedule />
          </main>
        </div>

        <aside className="w-1/2 h-full flex flex-col overflow-hidden">
          <Drawer courses={courses} />
        </aside>
      </div>
    </div>

    <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
  </>
);

export default DashboardViewSmall;
