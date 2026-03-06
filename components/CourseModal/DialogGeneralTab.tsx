import DialogTimeChart from "./DialogTimeChart";
import { Label } from "@/components/ui/label";
import { Course } from "@/app/dashboard/page";
import OccasionTable from "./OccasionTable";
import { LIU_DEPARTMENTS } from "@/lib/departmentShortName";

type DialogGeneralTabProps = {
  course: Course;
  showAdd : boolean;
};

const DialogGeneralTab = ({ course, showAdd }: DialogGeneralTabProps) => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Label>Examiner:</Label>
            {course.examiner === "" ? "N/A" : course.examiner}
          </div>
          <div>
            <Label>Department:</Label>
            {LIU_DEPARTMENTS[course.department] ?? "N/A"}
          </div>
          <div>
            <Label>Credits:</Label>
            {course.credits} ECTS
          </div>
          <div>
            <Label>Level:</Label>
            {course.level}
          </div>
          <div>
            <Label>Main Field:</Label>
            {course.mainField.length ? course.mainField.join(", ") : "N/A"}
          </div>
        </div>
        <DialogTimeChart
          scheduledHours={course.scheduledHours}
          selfStudyHours={course.selfStudyHours}
        />
      </div>

      <OccasionTable course={course} showAdd={showAdd} />
    </>
  );
};

export default DialogGeneralTab;
