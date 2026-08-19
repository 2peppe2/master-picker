import { cn } from "@/lib/utils";

interface DropTargetVisualState {
  isOver: boolean;
  isValidDropTarget: boolean;
  isWildcard: boolean;
  occupied: boolean;
}

export const getDropTargetVisualStyles = ({
  isOver,
  isValidDropTarget,
  isWildcard,
  occupied,
}: DropTargetVisualState) => {
  if (isValidDropTarget) {
    return isOver
      ? {
          stateStyles: cn(
            "z-10 animate-wiggle outline outline-[3px]",
            "-outline-offset-[3px] outline-teal-500 shadow-lg",
            "shadow-teal-500/20",
          ),
          overlayClassName:
            "absolute inset-0 rounded-xl bg-teal-500/20 pointer-events-none",
        }
      : {
          stateStyles: cn(
            "animate-wiggle outline outline-[3px]",
            "-outline-offset-[3px] outline-cyan-500",
          ),
          overlayClassName:
            "absolute inset-0 rounded-xl bg-cyan-500/10 pointer-events-none",
        };
  }
  if (isOver) {
    return {
      stateStyles:
        "outline outline-[3px] -outline-offset-[3px] outline-red-500",
      overlayClassName:
        "absolute inset-0 rounded-xl bg-red-500/10 pointer-events-none",
    };
  }
  if (occupied) return { stateStyles: "bg-transparent", overlayClassName: null };

  return {
    stateStyles: isWildcard
      ? cn(
          "border-[3px] border-dashed border-sky-500/20",
          "bg-sky-500/5 hover:border-sky-500/40",
          "hover:bg-sky-500/10 sm:border-4",
        )
      : cn(
          "border-[3px] border-dashed border-zinc-300",
          "bg-secondary/30 hover:border-zinc-400",
          "hover:bg-secondary/50 dark:border-zinc-700",
          "sm:border-4",
        ),
    overlayClassName: null,
  };
};
