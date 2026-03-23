"use client";

import { DialogFooter as CDialogFooter } from "@/components/ui/dialog";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { FC } from "react";

interface DialogFooterProps {
  course: Course;
}

const DialogFooter: FC<DialogFooterProps> = ({ course }) => (
  <CDialogFooter className="w-full shrink-0 justify-end sm:justify-end">
    <a href={course.link} target="_blank" rel="noopener noreferrer">
      <Button className="cursor-pointer" type="button" variant="link">
        <Translate text="_course_more_info" />
      </Button>
    </a>
  </CDialogFooter>
);

export default DialogFooter;
