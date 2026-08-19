"use client";

import type { Master } from "@/common/types";
import { atom, useAtomValue } from "jotai";

export const mastersAtom = atom<Record<string, Master>>({});

export const useMasterAtom = () => useAtomValue(mastersAtom);
