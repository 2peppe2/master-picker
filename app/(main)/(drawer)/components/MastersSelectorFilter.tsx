import { useAtom } from "jotai";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterAtom } from "@/app/atoms/FilterAtom";
import { produce } from "immer";
import { MasterBadge } from "@/components/MastersBadge";
import { Master } from "../../page";
import { useEffect, useState } from "react";
import { getMasters } from "@/app/actions/getMasters";


export function MasterSelectorFilter() {
  const [filter, setFilter] = useAtom(filterAtom);
  const [masters, setMasters] = useState<Master[]| null>();
  useEffect(() => {
    getMasters().then(setMasters);
  }, []);

  if (!masters) {
    return null;
  }
    return (
      <Select
        value={filter.masterProfile}
        onValueChange={onMasterProfileChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Master Profile" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Master Profiles</SelectLabel>
            <SelectItem value={"all"}>All Profiles</SelectItem>
            {masters.map((master) => (
              <SelectItem key={master.master} value={master.master}>
                <div className="flex items-center">
                  <MasterBadge master={master} />
                  <span
                    title={master.name ?? undefined}
                    className="ml-2 truncate"
                  >
                    {master.name && master.name.length > 24
                      ? master.name.slice(0, 21) + "…"
                      : master.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  function onMasterProfileChange(value: string) {
    setFilter(produce((prev) => {
      prev.masterProfile = value;
    }));
  }
}