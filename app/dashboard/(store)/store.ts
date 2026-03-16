"use client";

import { Course, Master } from "@/app/dashboard/page";
import { atom } from "jotai";

export const mastersAtom = atom<Record<string, Master>>({});
export const coursesAtom = atom<Record<string, Course>>({});
