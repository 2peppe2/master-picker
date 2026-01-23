import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAtomValue } from "jotai";
import { FC } from "react";

const ExcludeSlotConflictsFilter: FC = () => {
  const {
    atoms: { excludeSlotConflictsAtom },
    mutators: { excludeSlotConflicts },
  } = useFilterStore();
  const excludeConflicts = useAtomValue(excludeSlotConflictsAtom);

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={excludeConflicts}
        onCheckedChange={excludeSlotConflicts}
      />
      <Label className="text-sm">Show only applicable courses</Label>
    </div>
  );
};

export default ExcludeSlotConflictsFilter;
