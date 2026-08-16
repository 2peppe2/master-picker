import type { MultiSelectOption } from "@/components/ui/MultiSelect/types";
import { CourseFilterOption } from "./Option";

interface CourseFilterOptionsProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

/** The leaf of the drill-down: one checkbox per option of a section. */
export const CourseFilterOptions = ({
  options,
  selectedValues,
  onToggle,
}: CourseFilterOptionsProps) => (
  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
    {options.map((option) => (
      <CourseFilterOption
        key={option.value}
        option={option}
        checked={selectedValues.includes(option.value)}
        onToggle={onToggle}
      />
    ))}
  </div>
);
