import MasterBadgeRequirementTooltip from "./MasterBadgeRequirementTooltip";
import Translate from "@/common/components/translate/Translate";
import type { MasterRequirementSheetProps } from "./MasterRequirementSheet.types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FC } from "react";

const MasterRequirementSideSheet: FC<MasterRequirementSheetProps> = ({
  master,
  trigger,
  open,
  onOpenChange,
}) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
    <SheetContent
      side="right"
      className={cn(
        "w-[min(26rem,90vw)] gap-0 sm:max-w-none",
        "overflow-y-auto p-4",
        "pe-[calc(1rem+env(safe-area-inset-right))]",
      )}
    >
      {/* sr-only: the tooltip below renders its own visible heading. */}
      <SheetHeader className="sr-only">
        <SheetTitle>
          <Translate text="_master_requirements" />
        </SheetTitle>
        <SheetDescription>
          <Translate text="_master_requirements_details" />
        </SheetDescription>
      </SheetHeader>
      {/* Clears the absolutely positioned close button. */}
      <div className="pe-8">
        <MasterBadgeRequirementTooltip
          name={master.name}
          master={master.master}
          all={master.requirements}
          fulfilled={master.fulfilled}
          className="w-full max-w-none border-none bg-transparent p-0 shadow-none backdrop-blur-none"
        />
      </div>
    </SheetContent>
  </Sheet>
);

export default MasterRequirementSideSheet;
