import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface WildcardDividerProps {
  carousel: boolean;
}

const WildcardDivider: FC<WildcardDividerProps> = ({ carousel }) => (
  <div
    className={cn(
      carousel
        ? "flex h-40 w-px shrink-0 items-center bg-transparent"
        : "col-span-full my-1 h-px w-auto bg-border",
      "sm:col-span-full sm:my-1 sm:h-px sm:w-auto sm:bg-border",
      "lg:my-0 lg:h-40 lg:w-px lg:shrink-0",
      "lg:bg-transparent",
    )}
  >
    <Separator
      orientation="vertical"
      className={cn(
        "h-full w-px bg-zinc-600 sm:hidden lg:block",
        carousel ? "block" : "hidden",
      )}
    />
  </div>
);

export default WildcardDivider;
