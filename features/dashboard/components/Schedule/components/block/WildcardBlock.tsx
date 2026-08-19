"use client";

import { useBlockCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { useDashboardTabs } from "../../../DashboardView/DashboardTabContext";
import ScheduledCourseSlot from "./components/ScheduledCourseSlot";
import Translate from "@/common/components/translate/Translate";
import { Droppable } from "@/features/dashboard/components/Droppable";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockProps } from ".";
import { FC } from "react";

const WildcardBlock: FC<BlockProps> = ({ courseSlot, data }) => {
  const { deleteBlockFromSemester } = useBlockCommands();
  const { setActiveTab } = useDashboardTabs();
  const translate = useCommonTranslate();

  const handleRemoveSlot = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBlockFromSemester({
      semester: data.semesterNumber,
      blockIndex: data.blockNumber,
    });
  };

  const handleFilterChange = () => {
    setActiveTab("search");
  };

  return (
    <Droppable
      data={data}
      id={`ghost-${data.semesterNumber}-${data.periodNumber}-${data.blockNumber}`}
      occupied={Boolean(courseSlot)}
    >
      <ScheduledCourseSlot courseSlot={courseSlot} data={data} />
      {!courseSlot && (
        <div className="group relative h-full w-full">
          <button
            type="button"
            onClick={handleFilterChange}
            className={cn(
              "flex h-full w-full cursor-pointer flex-col",
              "items-center justify-center rounded-xl opacity-70",
              "transition-all duration-200 hover:bg-zinc-100/5",
              "hover:opacity-100 dark:hover:bg-zinc-800/50",
            )}
          >
            <span
              className={cn(
                "text-zinc-500 text-xs uppercase tracking-normal",
                "select-none",
              )}
            >
              <Translate text="wildcard_block_label" />
            </span>
          </button>
          <button
            onClick={handleRemoveSlot}
            type="button"
            aria-label={translate("_remove_block")}
            className={cn(
              "absolute right-1 top-1 z-10 size-8 text-zinc-400",
              "border-2 border-transparent rounded-md p-2",
              "cursor-pointer transition-all duration-200",
              "hover:bg-zinc-200 dark:hover:bg-zinc-700",
              "hover:text-zinc-600 dark:hover:text-zinc-200",
            )}
          >
            <X className="absolute top-1.5 right-1.5 h-4 w-4" />
          </button>
        </div>
      )}
    </Droppable>
  );
};

export default WildcardBlock;
