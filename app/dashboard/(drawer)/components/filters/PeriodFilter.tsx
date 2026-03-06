"use client";

import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FC, Fragment, useMemo } from "react";
import { useAtomValue } from "jotai";
import { range } from "lodash";

const PeriodFilter: FC = () => {
  const periods = useAtomValue(filterAtoms.periodsAtom);
  const { selectPeriods } = useFilterMutators();

  const options = useMemo(
    () =>
      range(1, 3).map((block) => ({
        label: block,
        value: block,
      })),
    [],
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Label className="text-sm">Include periods:</Label>
      {options.map((o) => (
        <Fragment key={o.value}>
          <Checkbox
            checked={periods.includes(o.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                selectPeriods([...periods, o.value]);
              } else {
                selectPeriods(periods.filter((b) => b !== o.value));
              }
            }}
          />
          <Label className="text-sm">{o.label}</Label>
        </Fragment>
      ))}
    </div>
  );
};

export default PeriodFilter;
