import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { MasterBadge } from "@/components/MasterBadge";
import { mastersAtom } from "@/app/atoms/mastersAtom";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

const MasterFilter: FC = () => {
  const {
    atoms: { masterAtom },
    mutators: { selectMaster },
  } = useFilterStore();
  const master = useAtomValue(masterAtom);
  const masters = useAtomValue(mastersAtom);

  const options = useMemo<Option[]>(
    () =>
      Object.values(masters).map((master) => ({
        value: master.master,
        label: master.name ?? "Unknown",
      })) satisfies Option[],
    [masters],
  );

  return (
    <Select value={master} onValueChange={selectMaster}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Master Profile" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Master Profiles</SelectLabel>
          <SelectItem value="all">All Profiles</SelectItem>
          {options.map((option) => (
            <MasterItem
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MasterFilter;

interface MasterItemProps {
  label: string;
  value: string;
}

const MasterItem: FC<MasterItemProps> = ({ label, value }) => {
  const masterName =
    label && label.length > 24 ? label.slice(0, 21) + "…" : label;

  return (
    <SelectItem value={value}>
      <div className="flex items-center">
        <MasterBadge name={value} />
        <span title={label ?? undefined} className="ml-2 truncate">
          {masterName}
        </span>
      </div>
    </SelectItem>
  );
};
