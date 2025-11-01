import { CourseCard } from "@/components/CourseCard/Card";
import { Draggable } from "@/components/CourseCard/Draggable";
import { useAtom } from "jotai";
import SearchInput from "./components/SearchInput";
import { Course } from "@/app/courses";
import semestersAtom from "@/app/atoms/semestersAtom";
import useFiltered from "@/components/Drawer/hooks/useFiltered";

export const Drawer = () => {
    const [semesters] = useAtom(semestersAtom);
    const notInDropped = (course: Course) => !semesters.flat(3).includes(course.code)
    const COURSES = useFiltered();
    return (
        <div className="border p-4 rounded-r-lg shadow-lg">
            <SearchInput />

            <div className="grid grid-cols-2 2xl:grid-cols-3 justify-items-center gap-4 mt-5">

                {Object.values(COURSES).filter(notInDropped).map((course) => (
                    <Draggable key={course.code} id={course.code} data={course}>
                        <CourseCard
                            {...course}
                            dropped={false}
                        />
                    </Draggable>
                ))}
            </div>
        </div>
    )
}
