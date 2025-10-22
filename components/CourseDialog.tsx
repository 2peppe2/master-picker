import { Course } from "@/app/courses";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { tr } from "framer-motion/client";
import { MastersBadge } from "./MastersBadge";

type CourseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course;

}

export const CourseDialog = ({ open, onOpenChange, course }: CourseDialogProps) => {
    const { courseName, courseCode, period, credits, level, block, link, mastersPrograms } = course;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{courseCode}</DialogTitle>
                    <DialogDescription>
                        {courseName}
                    </DialogDescription>
                </DialogHeader>


                <DialogFooter className="sm:justify-between">
                    <div>
                        {mastersPrograms.map((program) => (
                            <MastersBadge key={program} program={program} />
                        ))}
                    </div>


                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="link">More Info</Button>
                    </a>


                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}