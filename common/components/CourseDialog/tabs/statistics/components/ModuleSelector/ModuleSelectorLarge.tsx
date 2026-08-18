"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Translate from "@/common/components/translate/Translate";
import SelectedModule from "./components/SelectedModule";
import CategoryGroup from "./components/CategoryGroup";
import { ModuleSelectorViewProps } from "./types";
import { FC } from "react";

const ModuleSelectorLarge: FC<ModuleSelectorViewProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
  visibleCounts,
  setVisibleCount,
}) => (
  <Select
    value={selectedModule}
    onValueChange={(val) => {
      if (!val.startsWith("show-more-")) {
        setSelectedModule(val);
      }
    }}
  >
    <SelectTrigger className="w-full cursor-pointer overflow-hidden">
      <div className="flex w-full items-center justify-between pr-4">
        <SelectedModule
          selectedModule={selectedModule}
          selectedItem={selectedItem}
        />
      </div>
    </SelectTrigger>
    <SelectContent className="max-h-[350px]" data-no-drag="true">
      <SelectItem value="all" className="cursor-pointer font-bold">
        <Translate text="_all_examinations" />
      </SelectItem>
      {categorizedModules.map(([code, modules]) => (
        <CategoryGroup
          key={code}
          code={code}
          modules={modules}
          visibleCount={visibleCounts[code] || 5}
          setVisibleCount={(count) => setVisibleCount(code, count)}
        />
      ))}
    </SelectContent>
  </Select>
);

export default ModuleSelectorLarge;
