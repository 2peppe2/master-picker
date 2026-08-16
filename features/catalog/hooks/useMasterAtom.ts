"use client";

import { mastersAtom } from "../data";
import { useAtomValue } from "jotai";

export const useMasterAtom = () => useAtomValue(mastersAtom);
