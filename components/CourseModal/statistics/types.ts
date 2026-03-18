"use client";

import { Module } from "liu-tentor-package";

export interface ProcessedModule extends Module {
  displayDate?: string;
  isOriginal?: boolean;
}

export interface RawData {
  grade: string;
  quantity: number;
  gradeOrder: number;
}

export interface GradeMap {
  q: number;
  o: number;
}

export type CourseData = {
  modules?: Module[] | null;
};