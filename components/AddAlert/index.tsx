"use client";

import { Course } from "@/app/dashboard/page";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type AddAlertProps = {
    course: Course
    primaryAction: () => void;
    secondaryAction?: () => void; //To be used later for multiple courses in the same block
    open: boolean;
    setOpen: (open: boolean) => void;
    collisions: Course[];
};

const AddAlert = ({ course, primaryAction, secondaryAction, open, setOpen, collisions }: AddAlertProps) => {
    if (collisions.length === 0) {
        return null;
    }
    const collisionsText = collisions.length > 1 ? `${collisions.length} courses` : `${collisions[0].code}`
    return (
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogContent
                onPointerDownCapture={(e) => e.stopPropagation()}
                onMouseDownCapture={(e) => e.stopPropagation()}
                onTouchStartCapture={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Slot already occupied</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    The selected time slot for this course is already occupied by the following {collisions.length > 1 ? 'courses' : 'course'}:
                </AlertDialogDescription>
                <div className="text-sm mt-4 text-muted-foreground">
                    <ul className="my-4">
                        {collisions.map((course) => (
                            <li key={course.code}>
                                {course.code} - {course.name}
                            </li>
                        ))}
                        <br />


                    </ul>
                    What would you like to do?
                </div>


                <AlertDialogFooter>
                    <AlertDialogCancel>Keep {collisionsText}</AlertDialogCancel>
                    {secondaryAction &&
                        <Button variant="secondary" onClick={secondaryAction}>
                            Add to wildcard
                        </Button>}

                    <AlertDialogAction onClick={primaryAction}>
                        Add {course.code} anyway
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddAlert;