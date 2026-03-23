"use client";

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
      variant="outline"
      size="sm"
      onClick={onAdd}
      className="cursor-pointer h-8 gap-1.5 rounded-md border-border/80 bg-background px-2.5 text-xs font-semibold shadow-xs hover:bg-accent/60"
    >
      <Plus className="size-3.5" />
      <Translate text="_course_add_course" />
    </Button>
  </TableCell>
);

export default OccasionActionCell;
