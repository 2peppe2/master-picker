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
import { ModuleSelectorProps } from "./types";
import { useModuleSelectorVisibleCounts } from "./hooks/useModuleSelectorVisibleCounts";
import { Label } from "@/components/ui/label";
import { FC } from "react";

const ModuleSelectorLarge: FC<ModuleSelectorProps> = ({
  selectedModule,
  setSelectedModule,
  categorizedModules,
  selectedItem,
}) => {
  const { visibleCounts, setVisibleCount } = useModuleSelectorVisibleCounts();

  return (
    <div className="space-y-2" data-no-swipe="true">
      <Label className="text-sm font-medium text-foreground">
        <Translate text="_examination_history" />
      </Label>
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
    </div>
  );
};

export default ModuleSelectorLarge;
