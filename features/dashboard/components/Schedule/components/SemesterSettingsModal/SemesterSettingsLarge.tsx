"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import SettingsTriggerButton from "./components/SettingsTriggerButton";
import Translate from "@/common/components/translate/Translate";
import AddBlockRow from "./components/AddBlockRow";
import { SemesterSettingsViewProps } from "./types";
import { cn } from "@/lib/utils";
import { FC } from "react";

/** Tablet and desktop presentation: an anchored popover. */
const SemesterSettingsLarge: FC<SemesterSettingsViewProps> = ({
  isOpen,
  onOpenChange,
  onAddBlock,
}) => {
  const translate = useCommonTranslate();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <SettingsTriggerButton label={translate("_semester_settings")} />
      </PopoverTrigger>

      <PopoverContent align="end" className="p-0 overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p
            className={cn(
              "text-2xs font-bold text-muted-foreground",
              "uppercase tracking-normal",
            )}
          >
            <Translate text="_semester_settings" />
          </p>
        </div>

        <div className="p-1">
          <AddBlockRow onClick={onAddBlock} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SemesterSettingsLarge;
