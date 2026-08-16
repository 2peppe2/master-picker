"use client";

import { cn } from "@/lib/utils";

import { useDesktopCourseAddedFeedback } from "@/common/hooks/useCourseAddedFeedback";
import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import DndProvider from "@/features/dashboard/components/DndProvider";
import { DashboardTabProvider } from "./DashboardTabContext";
import DashboardViewLarge from "./DashboardViewLarge";
import { useDesktopDragLifecycle } from "./hooks/useDesktopDragLifecycle";
import type { DashboardTab } from ".";
import { useState } from "react";

const DashboardDesktopController = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("schedule");
  const drag = useDesktopDragLifecycle();
  useDesktopCourseAddedFeedback();

  return (
    <DashboardTabProvider activeTab={activeTab} setActiveTab={setActiveTab}>
      <div
        className={cn(
          "dashboard-page-root flex h-[100dvh] w-full flex-col overflow-hidden",
          "bg-background",
        )}
      >
        <DndProvider
          onDragEnd={drag.handleDragEnd}
          onDragStart={drag.handleDragStart}
          onDragCancel={drag.handleDragCancel}
          onDragOver={drag.handleDragOver}
          onRenderDragged={drag.handleRenderDragged}
        >
          {drag.conflictOpen && drag.conflictData && (
            <ConflictResolverModal
              open={drag.conflictOpen}
              setOpen={drag.setConflictOpen}
              conflictData={drag.conflictData}
            />
          )}
          <DashboardViewLarge />
        </DndProvider>
      </div>
    </DashboardTabProvider>
  );
};

export default DashboardDesktopController;
