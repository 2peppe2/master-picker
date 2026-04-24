"use client";

import { DialogFooter as CDialogFooter } from "@/components/ui/dialog";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { FC } from "react";

import { ExternalLink } from "lucide-react";

interface DialogFooterProps {
  course: Course;
}

const DialogFooter: FC<DialogFooterProps> = ({ course }) => (
  <CDialogFooter className="w-full shrink-0 justify-end sm:justify-end">
    <a href={course.link} target="_blank" rel="noopener noreferrer">
      <Button className="h-8 px-4 rounded-lg cursor-pointer gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.95]" type="button" variant="default">
        <Translate text="_course_more_info" />
        <ExternalLink className="size-3" />
      </Button>
    </a>
  </CDialogFooter>
);

export default DialogFooter;
