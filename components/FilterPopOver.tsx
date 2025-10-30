import { Label } from "@radix-ui/react-label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Check } from "lucide-react";
import { MastersBadge } from "./MastersBadge";
import { useAtom } from "jotai";
import { filterAtom } from "@/app/FilterAtom";
import { range } from "lodash";
import { Fragment } from "react";
import { produce } from "immer";
import masterRequirements from "./MastersRequirementsBar/data";
import { masterNames } from "./MasterHelper";

export const FilterPopOver = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  const masterProfiles = Object.keys(masterRequirements);
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="leading-none font-medium">Filter</h4>
      </div>
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="showOnly"
            checked={filter.showOnlyApplicable}
            onCheckedChange={onShowOnlyApplicableChange}
          />
          <Label htmlFor="showOnly" className="text-sm">
            Show only applicable courses
          </Label>
        </div>
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

        <div className="flex items-center gap-3">
          <Label className="text-sm">Include Semester:</Label>
          {range(0, filter.semester.length).map((index) => (
            <Fragment key={index}>
              <Checkbox
                id={`semester${index}`}
                checked={filter.semester[index]}
                onCheckedChange={(checked: boolean) =>
                  onSemesterChange(index, checked)
                }
              />
              <Label htmlFor={`semester${index}`} className="text-sm">
                {index + 7}
              </Label>
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm">Include Period:</Label>
          {range(0, filter.period.length).map((index) => (
            <Fragment key={index}>
              <Checkbox
                id={`period${index}`}
                checked={filter.period[index]}
                onCheckedChange={(checked: boolean) =>
                  onPeriodChange(index, checked)
                }
              />
              <Label htmlFor={`period${index}`} className="text-sm">
                {index + 1}
              </Label>
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-sm">Include Block:</Label>
          {range(0, filter.block.length).map((index) => (
            <Fragment key={index}>
              <Checkbox
                id={`block${index}`}
                checked={filter.block[index]}
                onCheckedChange={(checked: boolean) =>
                  onBlockChange(index, checked)
                }
              />
              <Label htmlFor={`block${index}`} className="text-sm">
                {index + 1}
              </Label>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
  function onShowOnlyApplicableChange(checked: boolean) {
    setFilter((prev) => ({
      ...prev,
      showOnlyApplicable: checked,
    }));
  }

  function onMasterProfileChange(value: string) {
    setFilter(produce((prev) => {
      prev.masterProfile = value;
    }));
  }

  function onSemesterChange(index: number, checked: boolean) {
    setFilter(
      produce((prev) => {
        prev.semester[index] = checked;
      })
    );
  }

  function onPeriodChange(period: number, checked: boolean) {
    setFilter(
      produce((prev) => {
        prev.period[period] = checked;
      })
    );
  }

  function onBlockChange(block: number, checked: boolean) {
    setFilter(
      produce((prev) => {
        prev.block[block] = checked;
      })
    );
  }
};
