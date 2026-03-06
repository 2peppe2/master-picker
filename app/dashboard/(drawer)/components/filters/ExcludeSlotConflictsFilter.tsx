import { useFilterMutators } from "@/app/atoms/filter/hooks/useFilterMutators";
import { filterAtoms } from "@/app/atoms/filter/atoms";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAtomValue } from "jotai";
import { FC } from "react";

const ExcludeSlotConflictsFilter: FC = () => {
  const excludeConflicts = useAtomValue(filterAtoms.excludeSlotConflictsAtom);
  const { excludeSlotConflicts } = useFilterMutators();

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={excludeConflicts}
        onCheckedChange={(checked) => excludeSlotConflicts(checked as boolean)}
      />
      <Label className="text-sm">Show only applicable courses</Label>
    </div>
  );
};

export default ExcludeSlotConflictsFilter;
