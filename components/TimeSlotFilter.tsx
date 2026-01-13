import { FC, Fragment } from "react";
import { range } from "lodash";

import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface TimeSlotFilterProps {
  states: boolean[];
  onChange: (index: number, checked: boolean) => void;
  title: string;
  offset?: number;
}

const TimeSlotFilter: FC<TimeSlotFilterProps> = ({
  states,
  onChange,
  title,
  offset = 1,
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    <Label className="text-sm">Include {title}:</Label>
    {range(0, states.length).map((index) => (
      <Fragment key={index}>
        <Checkbox
          id={title + index}
          checked={states[index]}
          onCheckedChange={(checked: boolean) => onChange(index, checked)}
        />
        <Label htmlFor={title + index} className="text-sm">
          {index + offset}
        </Label>
      </Fragment>
    ))}
  </div>
);

export default TimeSlotFilter;
