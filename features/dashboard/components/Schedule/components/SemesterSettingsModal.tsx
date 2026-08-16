"use client";

import { cn } from "@/lib/utils";

import { useBlockCommands } from "@/features/dashboard/state/schedule/hooks/useScheduleCommands";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FC } from "react";

interface SemesterSettingsModalProps {
  semester: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SemesterSettingsModal: FC<SemesterSettingsModalProps> = ({
  semester,
  isOpen,
  onOpenChange,
}) => {
  const { addBlockToSemester } = useBlockCommands();
  const translate = useCommonTranslate();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 hover:bg-accent"
          aria-label={translate("_semester_settings")}
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="p-0 overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p
            className={cn(
              "text-[10px] font-bold text-muted-foreground",
              "uppercase tracking-normal",
            )}
          >
            <Translate text="_semester_settings" />
          </p>
        </div>

        <div className="p-1">
          <button
            type="button"
            onClick={() => {
              addBlockToSemester(semester);
              onOpenChange(false);
            }}
            className={cn(
              "cursor-pointer w-full flex items-center gap-3 px-3",
              "py-2 text-sm rounded-md hover:bg-accent",
              "transition-colors group",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded border border-input flex",
                "items-center justify-center",
                "group-hover:border-muted-foreground transition-all",
              )}
            >
              <Plus
                className={cn(
                  "w-3 h-3 text-muted-foreground",
                  "group-hover:text-foreground",
                )}
              />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="font-medium text-foreground">
                <Translate text="_semester_settings_add_block" />
              </span>
              <span className="text-[11px] text-muted-foreground w-fit">
                <Translate text="_semester_settings_extend_blocks" />
              </span>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SemesterSettingsModal;
