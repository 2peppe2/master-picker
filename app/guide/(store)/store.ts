"use client";

import { Master } from "@/app/dashboard/page";
import { atom } from "jotai";

export const mastersAtom = atom<Record<string, Master>>({});
