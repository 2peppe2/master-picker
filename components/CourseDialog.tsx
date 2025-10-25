import { Course } from "@/app/courses";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { MastersBadge } from "./MastersBadge";
import Image from "next/image";

type CourseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course;

}

export const CourseDialog = ({ open, onOpenChange, course }: CourseDialogProps) => {
    const { name: courseName, code: courseCode, period, credits, level, block, link, mastersPrograms } = course;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{courseCode}</DialogTitle>
                    <DialogDescription>
                        {courseName}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <Label>Period:</Label>
                        <p>{period.length > 1 ? `Periods ${period.join(" and ")}` : `Period ${period[0]}`}</p>
                    </div>
                    <div>
                        <Label>Credits:</Label>
                        <p>{credits} ECTS</p>
                    </div>
                    <div>
                        <Label>Level:</Label>
                        <p>{level}</p>
                    </div>
                    <div>
                        <Label>Block:</Label>
                        <p>Block {block}</p>
                    </div>
                </div>


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