"use client";

import { cn } from "@/lib/utils";

import Translate from "@/common/components/translate/Translate";
import { NotebookText } from "lucide-react";
import { FC } from "react";

interface ExaminationSectionHeaderProps {
  count: number;
}

const ExaminationSectionHeader: FC<ExaminationSectionHeaderProps> = ({
  count,
}) => (
  <div className="mb-2 flex items-center justify-between">
    <p className="text-sm font-medium text-foreground">
      <Translate text="course_examinations" />
    </p>
    <span
      className={cn(
        "text-muted-foreground inline-flex items-center",
        "gap-1.5 text-xs",
      )}
    >
      <NotebookText className="size-3.5" />
      {count}{" "}
      {count === 1 ? (
        <Translate text="course_module_singular" />
      ) : (
        <Translate text="course_module_plural" />
      )}
    </span>
  </div>
);

export default ExaminationSectionHeader;
