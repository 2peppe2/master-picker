"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

interface AddButtonProps extends React.ComponentPropsWithRef<typeof Button> {
  courseCode: string;
}

const AddButton: FC<AddButtonProps> = ({ courseCode, className, ...props }) => {
  const translate = useCommonTranslate();

  return (
    <Button
      {...props}
      data-no-drag="true"
      // Opts out of the landscape hit-area floor in globals.css. That floor
      // would hold this at 32px, a third of the width of a ~100px tile, on top
      // of the course code. The ::after below restores the 32px target without
      // the footprint -- the button is already absolute, so it is its own
      // containing block, and pointer events on the pseudo-element still
      // bubble from the button, keeping drag and click behaviour intact.
      data-density-exempt
      aria-label={translate("_add_course", { courseCode })}
      variant="ghost"
      size="icon"
      className={cn(
        "absolute right-1 top-1 z-20 size-8 text-muted-foreground",
        "hover:text-foreground sm:right-1.5 sm:top-1.5",
        // -inset-2.5 rather than -2: at -2 the target computes to 31.99px,
        // which is a subpixel short of the 32px it is aiming for.
        "landscape-phone:size-6 landscape-phone:after:absolute",
        "landscape-phone:after:-inset-2.5 landscape-phone:after:content-['']",
        className,
      )}
    >
      <Plus className="size-3.5" />
    </Button>
  );
};

export default AddButton;
