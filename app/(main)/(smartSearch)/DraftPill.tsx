import React from "react";
import { DraftState } from "./types";

interface DraftPillProps {
  draft: DraftState;
  onEdit: (part: "category" | "operator") => void;
}

export const DraftPill: React.FC<DraftPillProps> = ({ draft, onEdit }) => {
  if (!draft.category) return null;

  return (
    <div className="flex items-center bg-gray-800 rounded overflow-hidden border border-gray-700 select-none text-sm">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit("category");
        }}
        className="px-2 py-1 hover:bg-gray-700 text-gray-300 transition-colors"
      >
        {draft.category.label}
      </button>
      {draft.operator && (
        <>
          <span className="text-gray-600 border-l border-gray-700 h-4"></span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit("operator");
            }}
            className="px-2 py-1 hover:bg-gray-700 text-gray-300 transition-colors font-mono text-xs"
          >
            {draft.operator.label}
          </button>
        </>
      )}
    </div>
  );
};
