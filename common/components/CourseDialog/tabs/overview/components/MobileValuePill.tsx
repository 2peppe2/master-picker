import { FC } from "react";

interface MobileValuePillProps {
  label: string;
  values: number[];
}

const MobileValuePill: FC<MobileValuePillProps> = ({ label, values }) => (
  <div className="min-w-14 rounded-xl bg-muted px-2.5 py-1.5 text-center">
    <span className="block text-2xs text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">
      {values.length > 0 ? values.join(", ") : "–"}
    </span>
  </div>
);

export default MobileValuePill;
