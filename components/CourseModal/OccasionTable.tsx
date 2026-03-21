"use client";

import { useScheduleMutators } from "@/app/dashboard/(store)/schedule/hooks/useScheduleMutators";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FC } from "react";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

interface OccasionTableProps {
  course: Course;
  showAdd: boolean;
}

const OccasionTable: FC<OccasionTableProps> = ({ course, showAdd }) => {
  const t = useCommonTranslate();
  const { addCourseByButton } = useScheduleMutators();

  return (
    <div className="rounded-md bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("_semester_label", { s: "" }).replace(" ", "")}
            </TableHead>
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("_period_label", { p: "" }).replace(" ", "")}
            </TableHead>
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("_block_label", { b: "" }).replace(" ", "")}
            </TableHead>
            <TableHead className="py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("_advanced")}
            </TableHead>
            {showAdd && (
              <TableHead className="text-right py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("_course_add_to_schedule")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {course.CourseOccasion.map((occ, idx) => (
            <TableRow
              key={`${occ.courseCode}-${occ.year}-${occ.semester}-${idx}`}
              className="group border-border/50 transition-colors hover:bg-muted/30"
            >
              <TableCell className="py-2 text-[11px] font-medium text-foreground">
                {occ.semester} {occ.year}
              </TableCell>
              <TableCell className="py-2 text-[11px] text-muted-foreground">
                {occ.periods.map((p) => p.period).join(", ")}
              </TableCell>
              <TableCell className="py-2 text-[11px] text-muted-foreground">
                {occ.periods.flatMap((p) => p.blocks).join(", ")}
              </TableCell>
              <TableCell className="py-2">
                <div className="flex flex-wrap gap-1">
                  {occ.recommendedMaster.map((master: { master: string; masterProgram: string }) => (
                    <span
                      key={master.master}
                      className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {master.master}
                    </span>
                  ))}
                </div>
              </TableCell>
              {showAdd && (
                <TableCell className="text-right py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 px-2 text-[10px] font-medium transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                    onClick={() => addCourseByButton({ course, occasion: occ })}
                  >
                    <Plus className="size-3" />
                    {t("_course_add_to_schedule")}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OccasionTable;
