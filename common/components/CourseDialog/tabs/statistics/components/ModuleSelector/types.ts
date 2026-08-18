import { ProcessedModule } from "../../types";

export interface ModuleSelectorProps {
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  categorizedModules: (readonly [string, ProcessedModule[]])[];
  selectedItem?: ProcessedModule;
}

/** Each presentation owns its own "show more" paging per category. */
export interface ModuleSelectorViewProps extends ModuleSelectorProps {
  visibleCounts: Record<string, number>;
  setVisibleCount: (code: string, count: number) => void;
}

export interface CategoryGroupProps {
  code: string;
  modules: ProcessedModule[];
  visibleCount: number;
  setVisibleCount: (count: number) => void;
}
