import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { SemesterOption } from "@/app/atoms/filter/types";
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
  const {
    atoms: { semesterAtom },
    mutators: { selectSemester },
  } = useFilterStore();

  const semester = useAtomValue(semesterAtom);

  const options = useMemo(
    () =>
      [
        { label: "All semesters", value: "all" },
        ...range(1, 10).map((semester) => ({
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
