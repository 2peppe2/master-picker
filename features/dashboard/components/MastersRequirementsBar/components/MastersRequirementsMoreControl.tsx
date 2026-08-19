import MastersRequirementsMoreTrigger from "./MastersRequirementsMoreTrigger";
import { BottomSheetTrigger } from "@/components/ui/bottom-sheet";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { SheetTrigger } from "@/components/ui/sheet";
import { FC } from "react";

interface MastersRequirementsMoreControlProps {
  count: number;
  presentation: "bottom-sheet" | "collapsible" | "sheet";
}

const MastersRequirementsMoreControl: FC<
  MastersRequirementsMoreControlProps
> = ({ count, presentation }) => {
  if (presentation === "sheet") {
    return (
      <SheetTrigger asChild>
        <MastersRequirementsMoreTrigger count={count} />
      </SheetTrigger>
    );
  }

  if (presentation === "bottom-sheet") {
    return (
      <BottomSheetTrigger asChild>
        <MastersRequirementsMoreTrigger count={count} />
      </BottomSheetTrigger>
    );
  }

  return (
    <CollapsibleTrigger asChild>
      <MastersRequirementsMoreTrigger count={count} />
    </CollapsibleTrigger>
  );
};

export default MastersRequirementsMoreControl;
