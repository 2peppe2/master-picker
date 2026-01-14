import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Course } from "@/app/(main)/page";
import { MasterBadge } from "../../MasterBadge";

type DialogFooterProps = {
    course: Course;
};  
const DialogFooterWithDetails = ({course} : DialogFooterProps) => {
    return (
        <DialogFooter className="sm:justify-between">
          <div>
            {course.CourseMaster.map((program) => (
              <MasterBadge key={program.master} name={program.master} />
            ))}
          </div>

          <a href={course.link} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="link">
              More Info
            </Button>
          </a>
        </DialogFooter>
    )
}

export default DialogFooterWithDetails;