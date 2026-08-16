"use client";

import type { Master } from "@/common/types";
import { atom } from "jotai";

export const mastersAtom = atom<Record<string, Master>>({});
