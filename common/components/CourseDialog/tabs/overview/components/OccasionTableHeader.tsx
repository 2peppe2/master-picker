"use client";

import { cn } from "@/lib/utils";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

interface OccasionTableHeaderProps {
  showRecommendedMaster: boolean;
  showAdd: boolean;
}

const OccasionTableHeader: FC<OccasionTableHeaderProps> = ({
  showRecommendedMaster,
  showAdd,
}) => (
  <TableHeader>
    <TableRow>
      <TableHead className="py-2 text-xs font-medium text-muted-foreground">
        <Translate text="semester" />
      </TableHead>
      <TableHead className="py-2 text-xs font-medium text-muted-foreground">
        <Translate text="period" />
      </TableHead>
      <TableHead className="py-2 text-xs font-medium text-muted-foreground">
        <Translate text="block" />
      </TableHead>
      {showRecommendedMaster && (
        <TableHead className="py-2 text-xs font-medium text-muted-foreground">
          <Translate text="recommended_for_master" />
        </TableHead>
      )}
      {showAdd && (
        <TableHead
          className={cn(
            "text-right py-2 text-xs font-medium",
            "text-muted-foreground",
          )}
        >
          <Translate text="_course_add_to_schedule" />
        </TableHead>
      )}
    </TableRow>
  </TableHeader>
);

export default OccasionTableHeader;
