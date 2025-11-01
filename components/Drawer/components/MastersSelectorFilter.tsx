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
import { MastersBadge } from "@/components/MastersBadge";
import { masterNames } from "@/components/MastersHelper";
import masterRequirements from "@/components/MastersRequirementsBar/data";



export function MasterSelectorFilter() {
  const [filter, setFilter] = useAtom(filterAtom);
  const masterProfiles = Object.keys(masterRequirements);
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
              {masterProfiles.map((profile) => (
                <SelectItem key={profile} value={profile}>
                  <div className="flex items-center">
                    <MastersBadge master={profile} />
                    <span
                      title={masterNames[profile]}
                      className="ml-2 truncate"
                    >
                      {masterNames[profile].length > 24
                        ? masterNames[profile].slice(0, 21) + "…"
                        : masterNames[profile]}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
    )
  function onMasterProfileChange(value: string) {
    setFilter(produce((prev) => {
      prev.masterProfile = value;
    }));
  }
}