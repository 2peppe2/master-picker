import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { FC } from "react";

type ToggleState = "open" | "closed";
type ProgressState = "fulfilled" | "incomplete";

interface ElectiveSelectorToggleProps {
  state: ToggleState;
  progress: ProgressState;
}

const getStateClassName = (
  state: ToggleState,
  progress: ProgressState,
) => {
  if (state === "closed") {
    return "bg-red-500/10 text-red-700 hover:bg-red-500/20";
  }
  if (progress === "fulfilled") {
    return "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20";
  }
  return "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20";
};

const ElectiveSelectorToggle: FC<ElectiveSelectorToggleProps> = ({
  state,
  progress,
}) => (
  <Button
    size="icon"
    className={`size-11 rounded-full transition-colors ${getStateClassName(state, progress)}`}
    disabled={state === "open" && progress === "incomplete"}
  >
    {state === "open" && progress === "fulfilled" && (
      <Check className="h-4 w-4" />
    )}
    {(state === "closed" || progress === "incomplete") && (
      <X className="h-4 w-4" />
    )}
  </Button>
);

export default ElectiveSelectorToggle;
