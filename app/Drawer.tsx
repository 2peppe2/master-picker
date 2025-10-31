import { CourseCard } from "@/components/CourseCard/Card";
import { Draggable } from "@/components/CourseCard/Draggable";
import { useAtom } from "jotai";
import SearchInput from "../components/SearchInput";
import { Course, COURSES } from "./courses";
import semestersAtom from "./atoms/semestersAtom";

export const Drawer = () => {
    const [semesters, setSemesters] = useAtom(semestersAtom);
    const notInDropped = (course: Course) => !semesters.flat(3).includes(course.code)
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
