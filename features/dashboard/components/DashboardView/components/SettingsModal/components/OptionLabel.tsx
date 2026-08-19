import { FC } from "react";

interface OptionLabelProps {
  label: string;
  description?: string;
}

const OptionLabel: FC<OptionLabelProps> = ({ label, description }) => (
  <div className="flex flex-col items-start leading-tight text-left">
    <span className="font-medium text-foreground">{label}</span>
    {description && (
      <span className="text-2xs text-muted-foreground">{description}</span>
    )}
  </div>
);

export default OptionLabel;
