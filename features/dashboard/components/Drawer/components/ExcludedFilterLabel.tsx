import { FC, ReactNode } from "react";

interface ExcludedFilterLabelProps {
  children: ReactNode;
}

const ExcludedFilterLabel: FC<ExcludedFilterLabelProps> = ({ children }) => (
  <span className="text-destructive line-through">{children}</span>
);

export default ExcludedFilterLabel;
