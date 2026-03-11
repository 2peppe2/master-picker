"use client";

import { XCircle } from "lucide-react";
import { FC } from "react";

interface GlobalClearButtonProps {
  onClear: () => void;
}

const GlobalClearButton: FC<GlobalClearButtonProps> = ({ onClear }) => (
  <button
    type="button"
    tabIndex={0}
    className="group transition-colors clear-action flex items-center justify-center p-1 mr-1 rounded-full cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClear();
    }}
  >
    <XCircle className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
  </button>
);

export default GlobalClearButton;
