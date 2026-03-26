"use client";

import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { FC } from "react";

interface ExaminationActionCellProps {
  onNavigateToStatistics: () => void;
}

const ExaminationActionCell: FC<ExaminationActionCellProps> = ({
  onNavigateToStatistics,
}) => (
  <TableCell>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
      onClick={onNavigateToStatistics}
    >
      <BarChart2 className="h-4 w-4" />
    </Button>
  </TableCell>
);

export default ExaminationActionCell;
