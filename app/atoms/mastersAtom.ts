import { atom } from "jotai";
import { Master } from "../dashboard/page";

export const mastersAtom = atom<Record<string, Master>>({});
