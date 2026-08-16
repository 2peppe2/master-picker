import { cn } from "@/lib/utils";
import type { MultiSelectOption } from "@/components/ui/MultiSelect/types";
import { Checkbox } from "@/components/ui/checkbox";

interface CourseFilterOptionProps {
  option: MultiSelectOption;
  checked: boolean;
  onToggle: (value: string) => void;
}

export const CourseFilterOption = ({
  option,
  checked,
  onToggle,
}: CourseFilterOptionProps) => (
  <label
    className={cn(
      "flex min-h-11 cursor-pointer items-center gap-3",
      "rounded-lg px-2 py-2 text-sm transition-colors",
      "hover:bg-muted/70",
    )}
  >
    <Checkbox
      checked={checked}
      onCheckedChange={() => onToggle(option.value)}
    />
    <span className="min-w-0 flex-1">
      {option.dropdownLabel ?? option.label}
    </span>
  </label>
);
