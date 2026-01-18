import React from "react";
import { Search, ChevronRight } from "lucide-react";
import { SearchOption, DraftState } from "./types";

interface SearchDropdownProps {
  options: SearchOption[];
  activeIndex: number;
  draft: DraftState;
  onSelect: (option: SearchOption) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  options,
  activeIndex,
  draft,
  onSelect,
}) => {
  if (options.length === 0) return null;

  const getHeader = () => {
    if (!draft.category) return "Filter Category";
    if (!draft.operator) return "Select Operator";
    return "Select Value";
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-60 bg-gray-800 border border-gray-700 rounded-md shadow-xl z-50 overflow-hidden">
      <div className="px-3 py-1 bg-gray-900 text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b border-gray-700">
        {getHeader()}
      </div>
      <ul className="max-h-60 overflow-y-auto">
        {options.map((opt, idx) => (
          <li
            key={opt.id}
            // MOUSE INTERACTION LOGIC:
            // preventDefault stops the input from losing focus (blur) when clicking the list
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(opt);
            }}
            className={`px-4 py-2 cursor-pointer flex items-center justify-between text-sm ${
              idx === activeIndex
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {opt.type === "search_free" && <Search className="w-3 h-3" />}
              {opt.type === "category" && (
                <span className="text-xs opacity-50 font-mono">#</span>
              )}
              <span>{opt.label}</span>
            </div>
            {opt.type !== "value" && opt.type !== "search_free" && (
              <ChevronRight className="w-3 h-3 opacity-50" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
