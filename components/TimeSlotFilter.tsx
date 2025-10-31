import { range } from "lodash"
import { Label } from "./ui/label"
import { Fragment } from "react";
import { Checkbox } from "./ui/checkbox";
import { produce } from "immer";
import { SetStateAction } from "jotai";

type TimeSlotFilterProps = {
    states: boolean[];
    onChange: (index: number, checked: boolean) => void;
    title: string;
    offset?: number;
};

export function TimeSlotFilter({ states, onChange, title, offset = 1 }: TimeSlotFilterProps) {
    return (
        <div className="flex items-center gap-3">
            <Label className="text-sm">Include {title}:</Label>
            {range(0, states.length).map((index) => (
                <Fragment key={index}>
                    <Checkbox
                        id={title + index}
                        checked={states[index]}
                        onCheckedChange={(checked: boolean) =>
                            onChange(index, checked)
                        }
                    />
                    <Label htmlFor={title + index} className="text-sm">
                        {index + offset}
                    </Label>
                </Fragment>
            ))}
        </div>
    );
}