import React from "react";
import { X } from "lucide-react";
import { SearchToken } from "./types";

interface SearchTokenItemProps {
  token: SearchToken;
  onRemove: (id: string) => void;
  onEdit: (
    token: SearchToken,
    part: "category" | "operator" | "value" | "full",
  ) => void;
}

export const SearchTokenItem: React.FC<SearchTokenItemProps> = ({
  token,
  onRemove,
  onEdit,
}) => {
  return (
    <div className="flex items-center bg-blue-900/40 text-blue-100 rounded border border-blue-800 animate-in zoom-in duration-100 overflow-hidden select-none">
      {token.type === "filter" ? (
        <div className="flex items-center text-sm">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEdit(token, "category");
            }}
            className="px-2 py-1 hover:bg-blue-800 cursor-pointer border-r border-blue-800/50 transition-colors"
          >
            {token.category.label}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEdit(token, "operator");
            }}
            className="px-2 py-1 hover:bg-blue-800 cursor-pointer border-r border-blue-800/50 transition-colors text-blue-300 font-mono text-xs"
          >
            {token.operator.label}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              onEdit(token, "value");
            }}
            className="px-2 py-1 hover:bg-blue-800 cursor-pointer transition-colors font-semibold"
          >
            {token.value.label}
          </span>
        </div>
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onEdit(token, "full");
          }}
          className="px-2 py-1 cursor-pointer hover:bg-blue-800 text-sm"
        >
          &quot;{token.label}&quot;
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(token.id);
        }}
        className="pr-2 pl-1 py-1 hover:text-white text-blue-300"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
