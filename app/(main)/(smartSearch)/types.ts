export type OptionType = "category" | "operator" | "value" | "search_free";

export interface SearchOption {
  id: string;
  label: string;
  value: any;
  type: OptionType;
  next?: string;
}

export type SearchSchema = Record<string, SearchOption[]>;

export type SearchToken =
  | {
      type: "filter";
      id: string;
      label: string;
      category: SearchOption;
      operator: SearchOption;
      value: SearchOption;
    }
  | { type: "text"; id: string; label: string; value: string };

export interface DraftState {
  category?: SearchOption;
  operator?: SearchOption;
}
