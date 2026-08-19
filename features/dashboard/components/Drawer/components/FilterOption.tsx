import type { ComponentType, FC, ReactNode } from "react";

interface FilterOptionProps {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}

const FilterOption: FC<FilterOptionProps> = ({ icon: Icon, children }) => (
  <div className="flex min-w-0 items-center gap-2">
    <Icon className="size-4 shrink-0 opacity-70" />
    <span className="truncate">{children}</span>
  </div>
);

export default FilterOption;
