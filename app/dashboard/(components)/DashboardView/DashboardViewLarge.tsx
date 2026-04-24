"use client";

import { useScrollToCourseFeedback } from "@/common/hooks/useCourseAddedFeedback";
import ConflictResolverModal from "@/components/ConflictResolverModal";
import { UseCourseDropHandler } from "./hooks/useCourseDropHandler";
import MastersRequirementsBar from "../MastersRequirementsBar";
import Disclaimer from "./components/Disclaimer";
import SettingsModal from "./components/SettingsModal";
import { DashboardViewProps } from "./index";
import Schedule from "../Schedule";
import Drawer from "../Drawer";
import { FC, useState } from "react";

interface DashboardViewLargeProps extends DashboardViewProps {
  dropHandler: UseCourseDropHandler;
}

const DashboardViewLarge: FC<DashboardViewLargeProps> = ({
  courses,
  dropHandler,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  useScrollToCourseFeedback();

  return (
    <div className="flex-1 flex flex-col md:grid md:[grid-template-columns:auto_1fr] relative items-start w-full overflow-hidden">
      {dropHandler.conflictOpen && dropHandler.conflictData && (
        <ConflictResolverModal
          open={dropHandler.conflictOpen}
          setOpen={dropHandler.setConflictOpen}
          conflictData={dropHandler.conflictData}
        />
      )}

      <aside className="bg-card border-r border-primary/10 h-full w-auto overflow-hidden shrink-0 z-20 sticky top-0 block">
        <Drawer courses={courses} />
      </aside>

      <main className="flex flex-col flex-none h-full bg-black/50 min-w-0 w-full relative overflow-hidden flex-1">
        <div className="bg-background overflow-y-auto flex flex-col flex-1">
          <div className="bg-card hidden xl:block shrink-0 border-b border-border/50">
            <Disclaimer />
            <div className="flex items-center px-8 py-4 bg-card gap-4 border-b">
              <div className="flex-1 min-w-0">
                <MastersRequirementsBar />
              </div>
              <SettingsModal
                isOpen={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
              />
            </div>
          </div>
          <div className="px-8 py-8 flex flex-col gap-4 flex-1">
            <Schedule />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardViewLarge;
