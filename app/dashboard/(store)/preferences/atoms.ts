import { atomWithReset } from "jotai/utils";
import { MasterPeriod } from "../types";

export const preferenceAtoms = {
  masterPeriodAtom: atomWithReset<MasterPeriod>({ start: 7, end: 10 }),
  showBachelorYearsAtom: atomWithReset<boolean>(false),
  activeTabAtom: atomWithReset<"schedule" | "search">("schedule"),
};
