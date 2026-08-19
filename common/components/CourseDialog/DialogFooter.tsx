"use client";

import { DialogFooter as CDialogFooter } from "@/components/ui/dialog";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { Course } from "@/common/types";
import { FC } from "react";

import { ExternalLink } from "lucide-react";

interface DialogFooterProps {
  course: Course;
}

/**
 * Only the centred desktop dialog has room for a footer. The sheet and the
 * landscape shell put the same actions in their header instead.
 */
const DialogFooter: FC<DialogFooterProps> = ({ course }) => (
  <CDialogFooter className="w-full shrink-0 justify-end sm:justify-end">
    <Button asChild className="h-8 rounded-lg px-4 text-xs font-semibold">
      <a href={course.link} target="_blank" rel="noopener noreferrer">
        <Translate text="_course_more_info" />
        <ExternalLink className="size-3" />
      </a>
    </Button>
  </CDialogFooter>
);

export default DialogFooter;
