"use client";

import { ProcessedModule } from "../../../types";
import { useMemo } from "react";

/** Newest examination first; shared by both category-group presentations. */
export const useSortedModules = (modules: ProcessedModule[]) =>
  useMemo(
    () =>
      [...modules].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [modules],
  );
