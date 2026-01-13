import { filterAtom } from "@/app/atoms/FilterAtom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAtom } from "jotai";
import { range } from "lodash";

const SemesterSelectorFilter = () => {
    const [filter, setFilter] = useAtom(filterAtom);
    const semesterIndexes  = range(1, 10); 
    const onSemesterChange = (value: string) => {
        if (value === "all") {
            setFilter((prev) => ({
                ...prev,
                semester: semesterIndexes,
            }));
            return;
        }
        const semesterIndex = parseInt(value);
        setFilter((prev) => ({
            ...prev,
            semester: [semesterIndex],
        }));
    };
    return (
        <Select value={filter.semester.toString()} onValueChange={onSemesterChange}>

            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select semester" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Semesters</SelectLabel>
                    <SelectItem value={"all"}>All </SelectItem>
                    {semesterIndexes.map((semester) => (
                        <SelectItem key={semester} value={semester.toString()}>
                            Semester {semester}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SemesterSelectorFilter;