"use client";

import { focusScheduleSlotAtom } from "@/features/dashboard/state/semester-ui/atoms";
import { useDashboardTabs } from "../../../DashboardView/DashboardTabContext";
import ScheduledCourseSlot from "./components/ScheduledCourseSlot";
import Translate from "@/common/components/translate/Translate";
import { Droppable } from "@/features/dashboard/components/Droppable";
import { useSetAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockProps } from ".";
import { FC } from "react";

const StandardBlock: FC<BlockProps> = ({ courseSlot, data }) => {
  const focusScheduleSlot = useSetAtom(focusScheduleSlotAtom);
  const { setActiveTab } = useDashboardTabs();

  const handleFilterChange = () => {
    focusScheduleSlot({
      semester: data.semesterNumber + 1,
      period: data.periodNumber + 1,
      block: data.blockNumber + 1,
    });
    setActiveTab("search");
  };

  return (
    <Droppable
      data={data}
      id={`block-${data.semesterNumber}-${data.periodNumber}-${data.blockNumber}`}
      occupied={Boolean(courseSlot)}
    >
      <ScheduledCourseSlot courseSlot={courseSlot} data={data} />
      {!courseSlot && (
        <button
          type="button"
          onClick={handleFilterChange}
          className={cn(
            "group flex h-full w-full cursor-pointer flex-col",
            "items-center justify-center rounded-xl",
          )}
        >
          <SearchIcon
            className={cn(
              "mb-2 size-7 text-zinc-500 transition-colors",
              "group-hover:text-foreground sm:size-8",
            )}
          />
          <span
            className={cn(
              "select-none text-sm font-medium text-zinc-500",
              "sm:text-base",
            )}
          >
            <Translate text="_block_label" args={{ b: data.blockNumber + 1 }} />
          </span>
        </button>
      )}
    </Droppable>
  );
};

export default StandardBlock;
