"use client";

import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";

interface RevealStepProps {
  show: boolean;
  children: ReactNode;
}

/*
 * A step in the program -> year -> master chain, collapsing when hidden so the
 * CTA stays next to the last usable control.
 *
 * grid-rows 0fr -> 1fr is what makes an auto-height box animate. The middle
 * element must clip for that, which would eat the 3px focus ring, so the
 * padding sits on a third wrapper and the outer box grows to match -- with a
 * plain w-full a revealed step lands 8px narrower than the first one.
 */
const RevealStep: FC<RevealStepProps> = ({ show, children }) => (
  <div
    className={cn(
      "-m-1 grid w-[calc(100%+0.5rem)] ease-emphasized",
      "transition-[grid-template-rows,opacity,transform] duration-300",
      show
        ? "translate-y-0 grid-rows-[1fr] opacity-100"
        : "-translate-y-2 grid-rows-[0fr] opacity-0",
    )}
    aria-hidden={!show}
    inert={!show}
  >
    <div className="overflow-hidden">
      <div className="p-1">{children}</div>
    </div>
  </div>
);

export default RevealStep;
