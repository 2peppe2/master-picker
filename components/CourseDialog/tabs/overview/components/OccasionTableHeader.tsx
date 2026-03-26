"use client";

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
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="semester" />
      </TableHead>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="period" />
      </TableHead>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="block" />
      </TableHead>
      {showRecommendedMaster && (
        <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          <Translate text="recommended_for_master" />
        </TableHead>
      )}
      {showAdd && (
        <TableHead className="text-right py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          <Translate text="_course_add_to_schedule" />
        </TableHead>
      )}
    </TableRow>
  </TableHeader>
);

export default OccasionTableHeader;
