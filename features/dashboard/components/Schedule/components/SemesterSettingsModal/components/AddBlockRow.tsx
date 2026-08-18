"use client";

import Translate from "@/common/components/translate/Translate";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface AddBlockRowProps {
  onClick: () => void;
  phone?: boolean;
}

const AddBlockRow: FC<AddBlockRowProps> = ({ onClick, phone = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "cursor-pointer w-full flex items-center gap-3 px-3",
      "py-2 text-sm rounded-md hover:bg-accent",
      "transition-colors group",
      // Aligns the row with the sheet title instead of indenting past it.
      phone && "min-h-12 px-0",
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
      <span className="text-2xs text-muted-foreground w-fit">
        <Translate text="_semester_settings_extend_blocks" />
      </span>
    </div>
  </button>
);

export default AddBlockRow;
