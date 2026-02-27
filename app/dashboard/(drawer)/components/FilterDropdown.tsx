import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
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
      <PeriodFilter />
      <BlockFilter />
    </div>
  </div>
);
export default FilterDropdown;

const Header: FC = () => {
  const { resetFilter } = useFilterMutators();

  return (
    <div className="flex justify-between items-baseline w-full space-y-2">
      <h4 className="leading-none font-medium">Filters</h4>

      <Button variant="outline" onClick={() => resetFilter()}>
        Reset Filters
      </Button>
    </div>
  );
};
