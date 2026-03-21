"use client";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { FC } from "react";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

interface DialogFooterProps {
  course: Course;
}

const DialogFooterWithDetails: FC<DialogFooterProps> = ({ course }) => {
  const t = useCommonTranslate();

  return (
    <DialogFooter className="w-full shrink-0 justify-end sm:justify-end">
      <a href={course.link} target="_blank" rel="noopener noreferrer">
        <Button className="cursor-pointer" type="button" variant="link">
          {t("_course_more_info")}
        </Button>
      </a>
    </DialogFooter>
  );
};

export default DialogFooterWithDetails;
