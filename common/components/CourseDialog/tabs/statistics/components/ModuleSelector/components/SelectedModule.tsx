"use client";

import Translate from "@/common/components/translate/Translate";
import { ProcessedModule } from "../../../types";
import ExamBadge from "../../ExamBadge";
import { FC } from "react";

interface SelectedModuleProps {
  selectedModule: string;
  selectedItem?: ProcessedModule;
}

const SelectedModule: FC<SelectedModuleProps> = ({
  selectedModule,
  selectedItem,
}) => (
  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
    <span className="truncate">
      {selectedModule === "all" ? (
        <Translate text="_all_examinations" />
      ) : (
        `${selectedItem?.moduleCode}: ${selectedItem?.displayDate}`
      )}
    </span>
    {selectedItem && (
      <ExamBadge
        moduleCode={selectedItem.moduleCode}
        isOriginal={selectedItem.isOriginal}
      />
    )}
  </div>
);

export default SelectedModule;
