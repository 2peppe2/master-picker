"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { FC } from "react";

interface DialogFooterProps {
  course: Course;
}

const DialogFooterWithDetails: FC<DialogFooterProps> = ({ course }) => (
  <DialogFooter className="w-full justify-end sm:justify-end">
    <a href={course.link} target="_blank" rel="noopener noreferrer">
      <Button type="button" variant="link">
        More Info
      </Button>
    </a>
  </DialogFooter>
);
export default DialogFooterWithDetails;
