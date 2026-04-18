"use client";

import { useScrollToCourseFeedback } from "@/common/hooks/useCourseAddedFeedback";
import ConflictResolverModal from "@/components/ConflictResolverModal";
import { useCourseDropHandler } from "./hooks/useCourseDropHandler";
import { scheduleAtoms } from "../../(store)/schedule/atoms";
import { PeriodNodeData } from "@/components/Droppable";
import CourseCard from "@/components/CourseCard";
import GlobalHeader from "./components/GlobalHeader";
import { FC, useCallback, useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Course } from "../../page";
import Schedule from "../Schedule";
import {
  DndProvider,
  OnDragEndArgs,
  OnDragStartArgs,
} from "@/components/DndProvider";
import { useAtom } from "jotai";
import Drawer from "../Drawer";
import { useIsMobile } from "@/common/hooks/useIsMobile";

interface DndViewProps {
  courses: Course[];
}

interface DndViewMobileProps extends DndViewProps {
  dropHandler: ReturnType<typeof useCourseDropHandler>;
  activeTab: 'schedule' | 'search';
  setActiveTab: (tab: 'schedule' | 'search') => void;
}

const DndViewMobile: FC<DndViewMobileProps> = ({ 
  courses, 
  dropHandler, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      <GlobalHeader />

      <div className="flex-1 flex flex-col relative items-start w-full overflow-hidden">
        {dropHandler.conflictOpen && dropHandler.conflictData && (
          <ConflictResolverModal
            open={dropHandler.conflictOpen}
            setOpen={dropHandler.setConflictOpen}
            conflictData={dropHandler.conflictData}
          />
        )}

        <aside className={`bg-card w-full overflow-hidden shrink-0 z-20 ${activeTab === 'search' ? 'block' : 'hidden'}`}>
          <Drawer courses={courses} />
        </aside>

        <main className={`flex flex-col flex-1 h-full bg-black/50 min-w-0 w-full relative overflow-hidden ${activeTab === 'schedule' ? 'flex' : 'hidden'}`}>
          <div className="bg-background overflow-y-auto flex flex-col flex-1 px-4 gap-4 py-4">
            <Schedule />
          </div>
        </main>
      </div>

      <div className="bg-card/95 backdrop-blur-md border-t border-border p-3 shrink-0 pb-safe z-50">
        <div className="flex items-center justify-center bg-muted p-1.5 rounded-xl gap-1 shadow-inner relative">
          <div 
            className={`absolute left-1 top-1 bottom-1 w-[calc(50%-6px)] bg-background rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${activeTab === 'search' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} 
          />
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors relative z-10 ${
              activeTab === 'schedule'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors relative z-10 ${
              activeTab === 'search'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

interface DndViewDesktopProps extends DndViewProps {
  dropHandler: ReturnType<typeof useCourseDropHandler>;
}

const DndViewDesktop: FC<DndViewDesktopProps> = ({ 
  courses, 
  dropHandler 
}) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      <GlobalHeader />

      <div className="flex-1 flex flex-col xl:grid xl:[grid-template-columns:auto_1fr] relative items-start w-full overflow-hidden">
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
          <div className="bg-background overflow-y-auto flex flex-col flex-1 px-8 gap-4 py-8">
            <Schedule />
          </div>
        </main>
      </div>
    </div>
  );
};

const DndView: FC<DndViewProps> = ({ courses }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'search'>('schedule');
  const [draggedCourse, setDraggedCourse] = useAtom(
    scheduleAtoms.draggedCourseAtom,
  );
  
  const isMobile = useIsMobile();
  const dropHandler = useCourseDropHandler();

  useScrollToCourseFeedback();

  const onDragEnd = useCallback(
    (event: OnDragEndArgs) => {
      setDraggedCourse(null);
      if (!event.over || !draggedCourse) {
        return;
      }

      dropHandler.handleDrop({
        course: draggedCourse,
        overData: event.over.data.current as PeriodNodeData,
      });
    },
    [dropHandler, draggedCourse, setDraggedCourse],
  );

  return (
    <DndProvider<Course>
      disabled={isMobile}
      onDragEnd={onDragEnd}
      onDragStart={(event: OnDragStartArgs<Course>) =>
        setDraggedCourse(event.active)
      }
      onDragCancel={() => {
        setDraggedCourse(null);
      }}
      renderDragged={({ active }) => (
        <CourseCard variant="dragged" course={active} />
      )}
    >
      {isMobile ? (
        <DndViewMobile 
          courses={courses}
          dropHandler={dropHandler}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <DndViewDesktop 
          courses={courses}
          dropHandler={dropHandler}
        />
      )}
    </DndProvider>
  );
};

export default DndView;
