"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Translate from "@/common/components/translate/Translate";
import { FC } from "react";

const ExaminationTableHeader: FC = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="_course_name" />
      </TableHead>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="_course_module" />
      </TableHead>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="_course_credits" />
      </TableHead>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="_course_scale" />
      </TableHead>
      <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        <Translate text="_course_last_original_statistics" />
      </TableHead>
      <TableHead />
    </TableRow>
  </TableHeader>
);

export default ExaminationTableHeader;
