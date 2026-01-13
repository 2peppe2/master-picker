import { atom } from "jotai";
import { Master } from "../(main)/page";

export const mastersAtom = atom<Record<string, Master>>({});
