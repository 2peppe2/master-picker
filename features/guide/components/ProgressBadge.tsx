import Translate from "@/common/components/translate/Translate";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";

export interface ProgressStep {
  states: {
    active: { labelKey: string; style: string };
    default: { labelKey: string; style: string };
  };
  isDone: boolean;
}

interface ProgressBadgeProps extends ProgressStep {
  id: string;
}

const ProgressBadge: FC<ProgressBadgeProps> = ({ id, states, isDone }) => {
  const state = states[isDone ? "active" : "default"];

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs transition-all duration-300",
        state.style,
      )}
    >
      {isDone && <Check className="h-3 w-3" />}
      {`${id}. `}
      <Translate text={state.labelKey} />
    </Badge>
  );
};

export default ProgressBadge;
