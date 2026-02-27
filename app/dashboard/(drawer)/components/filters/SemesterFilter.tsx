import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
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
  const semester = useAtomValue(filterAtoms.semesterAtom);
  const { selectSemester } = useFilterMutators();

  const options = useMemo(
    () =>
      [
        { label: "All semesters", value: "all" },
        ...range(1, 11).map((semester) => ({
          label: `Semester ${semester.toString()}`,
          value: semester as SemesterOption,
        })),
      ] satisfies Option[],
    [],
  );

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
