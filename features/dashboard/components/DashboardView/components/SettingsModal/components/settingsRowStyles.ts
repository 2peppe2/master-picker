import { cn } from "@/lib/utils";

export const optionRowClasses = (phone: boolean) =>
  cn(
    "cursor-pointer w-full flex items-center gap-3 text-sm",
    "rounded-md hover:bg-accent transition-colors group",
    phone ? "min-h-12 px-0 py-2" : "px-3 py-2",
  );
