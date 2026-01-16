import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Course } from "@/app/(main)/page";

type DialogFooterProps = {
    course: Course;
};  
const DialogFooterWithDetails = ({course} : DialogFooterProps) => {
    return (
        <DialogFooter className="flex justify-end">
          <a href={course.link} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="link">
              More Info
            </Button>
          </a>
        </DialogFooter>
    )
}

export default DialogFooterWithDetails;