import { Label } from "@radix-ui/react-label";
import { Checkbox } from "./ui/checkbox";

import { Check } from "lucide-react";
import { MastersBadge } from "./MastersBadge";
import { useAtom } from "jotai";
import { filterAtom } from "@/app/atoms/FilterAtom";
import { range } from "lodash";
import { Fragment } from "react";
import { produce } from "immer";
import masterRequirements from "./MastersRequirementsBar/data";
import { masterNames } from "./MasterHelper";
import { MasterSelectorFilter } from "./MasterSelectorFilter";
import { TimeSlotFilter } from "./TimeSlotFilter";

export const FilterPopOver = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  const masterProfiles = Object.keys(masterRequirements);
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="leading-none font-medium">Filters</h4>
      </div>
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="showOnly"
            checked={filter.showOnlyApplicable}
            onCheckedChange={onShowOnlyApplicableChange}
          />
          <Label htmlFor="showOnly" className="text-sm">
            Show only applicable courses
          </Label>
        </div>
        <MasterSelectorFilter />
        <TimeSlotFilter
          states={filter.semester}
          onChange={(index, checked) => onTimeChange("semester", index, checked)}
          title="Semester"
          offset={7}
        />
        <TimeSlotFilter
          states={filter.period}
          onChange={(index, checked) => onTimeChange("period", index, checked)}
          title="Period"
        />
        <TimeSlotFilter
          states={filter.block}
          onChange={(index, checked) => onTimeChange("block", index, checked)}
          title="Block"
        />
      </div>
    </div>
  );
  function onShowOnlyApplicableChange(checked: boolean) {
    setFilter((prev) => ({
      ...prev,
      showOnlyApplicable: checked,
    }));
  }

  function onTimeChange<K extends "semester" | "period" | "block">(
    key: K,
    index: number,
    checked: boolean
  ) {
    setFilter(
      produce((prev) => {
        prev[key][index] = checked;
      })
    );
  }
};
