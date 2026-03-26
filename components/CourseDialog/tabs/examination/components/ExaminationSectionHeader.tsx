"use client";

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
    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
      <Translate text="_course_examinations" />
    </p>
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
      <NotebookText className="size-3.5" />
      {count}{" "}
      {count === 1 ? (
        <Translate text="_course_module_singular" />
      ) : (
        <Translate text="_course_module_plural" />
      )}
    </span>
  </div>
);

export default ExaminationSectionHeader;
