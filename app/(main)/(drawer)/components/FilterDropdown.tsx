import ExcludeSlotConflictsFilter from "./filters/ExcludeSlotConflictsFilter";
import { useFilterStore } from "@/app/atoms/filter/filterStore";
import SemesterFilter from "./filters/SemesterFilter";
import MasterFilter from "./filters/MasterFilter";
import PeriodFilter from "./filters/PeriodFilter";
import { Button } from "@/components/ui/button";
import BlockFilter from "./filters/BlockFilter";
import { FC } from "react";

const FilterDropdown = () => (
  <div className="grid gap-4">
    <Header />
    <div className="grid gap-4">
      <MasterFilter />
      <SemesterFilter />
      <ExcludeSlotConflictsFilter />
      <PeriodFilter />
      <BlockFilter />
    </div>
  </div>
);
export default FilterDropdown;

const Header: FC = () => {
  const {
    mutators: { reset },
  } = useFilterStore();

  return (
    <div className="flex justify-between items-baseline w-full space-y-2">
      <h4 className="leading-none font-medium">Filters</h4>

      <Button variant="outline" onClick={() => reset()}>
        Reset Filters
      </Button>
    </div>
  );
};
