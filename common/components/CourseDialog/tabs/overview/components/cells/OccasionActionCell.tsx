"use client";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC } from "react";

interface OccasionActionCellProps {
  onAdd: () => void;
}

const OccasionActionCell: FC<OccasionActionCellProps> = ({ onAdd }) => (
  <TableCell className="text-right">
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onAdd}
      className={cn(
        "h-8 cursor-pointer gap-1.5 rounded-full",
        "bg-primary/10 px-3 text-xs font-semibold",
        "text-primary shadow-none hover:bg-primary/20",
      )}
    >
      <Plus className="size-3.5" />
      <Translate text="_course_add_course" />
    </Button>
  </TableCell>
);

export default OccasionActionCell;
