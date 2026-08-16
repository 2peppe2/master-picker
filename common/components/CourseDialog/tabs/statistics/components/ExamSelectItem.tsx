"use client";

import { SelectItem } from "@/components/ui/select";
import { ProcessedModule } from "../types";
import ExamBadge from "./ExamBadge";
import { FC } from "react";

interface ExamSelectItemProps {
  moduleData: ProcessedModule;
}

const ExamSelectItem: FC<ExamSelectItemProps> = ({ moduleData }) => (
  <SelectItem
    className="w-full cursor-pointer"
    value={`${moduleData.moduleCode}-${moduleData.date}`}
  >
    <div className="flex items-center w-full">
      <span>{moduleData.displayDate}</span>
      <div className="ml-auto flex items-center">
        <ExamBadge
          moduleCode={moduleData.moduleCode}
          isOriginal={moduleData.isOriginal}
        />
      </div>
    </div>
  </SelectItem>
);

export default ExamSelectItem;
