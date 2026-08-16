"use client";

import { cn } from "@/lib/utils";

import { DialogFooter as CDialogFooter } from "@/components/ui/dialog";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { Course } from "@/common/types";
import { FC } from "react";

import { ExternalLink } from "lucide-react";

interface DialogFooterProps {
  course: Course;
  onClose?: () => void;
  phone?: boolean;
}

const DialogFooter: FC<DialogFooterProps> = ({
  course,
  onClose,
  phone = false,
}) => {
  const actions = (
    <>
      <Button
        asChild
        className={
          phone
            ? "h-11 flex-1 rounded-lg text-xs font-semibold"
            : "h-8 rounded-lg px-4 text-xs font-semibold"
        }
      >
        <a href={course.link} target="_blank" rel="noopener noreferrer">
          <Translate text="_course_more_info" />
          <ExternalLink className="size-3" />
        </a>
      </Button>
      {phone && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="h-11 flex-1 rounded-lg text-xs font-semibold"
        >
          <Translate text="_course_close" />
        </Button>
      )}
    </>
  );

  if (phone) {
    return (
      <div
        className={cn(
          "mt-auto flex shrink-0 gap-3 border-t bg-background",
          "px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
          "pt-3",
        )}
      >
        {actions}
      </div>
    );
  }

  return (
    <CDialogFooter className="w-full shrink-0 justify-end sm:justify-end">
      {actions}
    </CDialogFooter>
  );
};

export default DialogFooter;
