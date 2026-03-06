import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
import { userPreferencesAtom } from "@/app/atoms/UserPreferences";
import { SemesterOption } from "@/app/atoms/filter/types";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { range } from "lodash";

interface Option {
  label: string;
  value: SemesterOption;
}

const SemesterFilter: FC = () => {
  const { showBachelorYears } = useAtomValue(userPreferencesAtom);
  const semester = useAtomValue(filterAtoms.semesterAtom);
  const { selectSemester } = useFilterMutators();

  const options = useMemo(() => {
    const start = showBachelorYears ? 1 : 7;

    return [
      { label: "All semesters", value: "all" },
      ...range(start, 11).map((semester) => ({
        label: `Semester ${semester.toString()}`,
        value: semester as SemesterOption,
      })),
    ] satisfies Option[];
  }, [showBachelorYears]);

  return (
    <Select
      value={semester.toString()}
      onValueChange={(value) => selectSemester(value as SemesterOption)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select semester" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semesters</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SemesterFilter;
