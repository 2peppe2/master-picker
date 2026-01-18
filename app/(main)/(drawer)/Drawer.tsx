import CourseCard from "@/components/CourseCard";
import { Draggable } from "@/components/CourseCard/Draggable";
import { activeCourseAtom } from "@/app/atoms/ActiveCourseAtom";
import { useAtomValue } from "jotai";
import { FC, useState } from "react";
import { Course } from "../page";
import { useScheduleStore } from "@/app/atoms/schedule/scheduleStore";
import { useFiltered } from "@/app/atoms/filter/filterStore";
import SmartSearchInput from "../(smartSearch)/SmartSearchInput";
import { SearchSchema, SearchToken } from "../(smartSearch)/types";

interface DrawerProps {
  courses: Course[];
}

const USER_FILTER_SCHEMA: SearchSchema = {
  root: [
    {
      id: "role",
      label: "Role",
      value: "role",
      type: "category",
      next: "role_ops",
    },
    {
      id: "status",
      label: "Status",
      value: "status",
      type: "category",
      next: "status_ops",
    },
    {
      id: "dept",
      label: "Department",
      value: "department",
      type: "category",
      next: "dept_ops",
    },
  ],

  // 2. Operators for Role
  role_ops: [
    { id: "is", label: "is", value: "eq", type: "operator" },
    { id: "is_not", label: "is not", value: "neq", type: "operator" },
  ],
  // 3. Values for Role (Format: [CategoryID]_values)
  role_values: [
    { id: "admin", label: "Admin", value: "admin", type: "value" },
    { id: "dev", label: "Developer", value: "developer", type: "value" },
    { id: "manager", label: "Manager", value: "manager", type: "value" },
  ],

  // Status Flow
  status_ops: [{ id: "is", label: "is", value: "eq", type: "operator" }],
  status_values: [
    { id: "active", label: "Active", value: "active", type: "value" },
    { id: "offline", label: "Offline", value: "offline", type: "value" },
  ],

  // Department Flow
  dept_ops: [{ id: "in", label: "in", value: "in", type: "operator" }],
  dept_values: [
    { id: "eng", label: "Engineering", value: "eng", type: "value" },
    { id: "hr", label: "Human Resources", value: "hr", type: "value" },
  ],
};

export const Drawer: FC<DrawerProps> = ({ courses }) => {
  const [filters, setFilters] = useState<SearchToken[]>([]);

  const { state } = useScheduleStore();

  const notInDropped = (course: Course) =>
    !state.schedules.flat(3).includes(course);
  const COURSES = useFiltered(courses);
  const activeCourse = useAtomValue(activeCourseAtom);

  return (
    <div className="border p-4 rounded-r-lg shadow-lg max-h-screen overflow-y-auto overflow-x-hidden sticky top-0">
      <SmartSearchInput
        value={filters}
        onChange={setFilters}
        schema={USER_FILTER_SCHEMA}
      />
      <div className="grid grid-cols-2 2xl:grid-cols-3 justify-items-center gap-4 mt-5">
        {Object.values(COURSES)
          .filter(notInDropped)
          .filter((course) => course.code !== activeCourse?.code)
          .map((course) => (
            <Draggable key={course.code} id={course.code} data={course}>
              <CourseCard course={course} dropped={false} />
            </Draggable>
          ))}
      </div>
    </div>
  );
};
