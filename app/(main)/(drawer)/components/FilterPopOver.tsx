import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";

import { filterAtom } from "@/app/atoms/FilterAtom";
import TimeSlotFilter from "@/components/TimeSlotFilter";
import { produce } from "immer";
import { useAtom } from "jotai";
import { MasterSelectorFilter } from "./MastersSelectorFilter";
import { Button } from "@/components/ui/button";
import { RESET } from "jotai/utils";

export const FilterPopOver = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="leading-none font-medium">Filters</h4>
      </div>
      <div className="grid gap-4">
        <Button variant="outline" onClick={() => setFilter(RESET)}>
          Reset Filters
        </Button>
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
          onChange={(index, checked) =>
            onTimeChange("semester", index, checked)
          }
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
