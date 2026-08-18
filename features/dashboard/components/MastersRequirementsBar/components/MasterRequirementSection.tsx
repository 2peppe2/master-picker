import MasterRequirementRow from "./MasterRequirementRow";
import { RequirementUnion } from "@/common/types";
import { FC, ReactNode } from "react";

interface MasterRequirementSectionProps {
  title: string;
  icon: ReactNode;
  items: RequirementUnion[];
  fulfilled: RequirementUnion[];
}

const MasterRequirementSection: FC<MasterRequirementSectionProps> = ({
  title,
  icon,
  items,
  fulfilled,
}) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-normal text-muted-foreground">
        <span className="p-1 rounded bg-secondary text-primary">{icon}</span>
        {title}
      </div>
      <div className="grid gap-2 ml-1">
        {items.map((requirement, index) => (
          <MasterRequirementRow
            key={`master-requirement-row-${index}`}
            requirement={requirement}
            isFulfilled={fulfilled.some(
              (item) => JSON.stringify(item) === JSON.stringify(requirement),
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterRequirementSection;
