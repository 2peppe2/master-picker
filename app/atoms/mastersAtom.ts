import { Master } from "../dashboard/page";
import { atom } from "jotai";

export const mastersAtom = atom<Record<string, Master>>({});
