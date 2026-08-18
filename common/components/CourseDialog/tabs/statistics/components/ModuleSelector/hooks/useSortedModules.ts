"use client";

import { ProcessedModule } from "../../../types";
import { useMemo } from "react";

export const useSortedModules = (modules: ProcessedModule[]) =>
  useMemo(
    () =>
      [...modules].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [modules],
  );
