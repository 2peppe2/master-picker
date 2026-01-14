import { Label } from "@/components/ui/label";
import OccasionTable from "../OccasionTable";
import { Course } from "@/app/(main)/page";
import DialogTimeChart from "./DialogTimeChart";

type DialogGeneralTabProps = {
  course: Course;
};

const DialogGeneralTab = ({ course }: DialogGeneralTabProps) => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Label>Examiner:</Label>
            {course.examiner === "" ? "N/A" : course.examiner}
          </div>
          <div>
            <Label>Credits:</Label>
            {course.credits} ECTS
          </div>
          <div>
            <Label>Level:</Label>
            {course.level}
          </div>
        </div>
        <DialogTimeChart
          scheduledHours={course.scheduledHours}
          selfStudyHours={course.selfStudyHours}
        />
      </div>

      <OccasionTable course={course} />
    </>
  )
}

export default DialogGeneralTab;
