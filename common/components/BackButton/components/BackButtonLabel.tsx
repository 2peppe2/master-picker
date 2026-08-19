"use client";

import Translate from "@/common/components/translate/Translate";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FC } from "react";

interface BackButtonLabelProps {
  title: string;
  subtitle: string;
  returnText: string;
  isHovered: boolean;
  compact: boolean;
}

const BackButtonLabel: FC<BackButtonLabelProps> = ({
  title,
  subtitle,
  returnText,
  isHovered,
  compact,
}) => (
  <div className="flex min-w-0 flex-col">
    <span className="truncate whitespace-nowrap text-sm font-bold text-foreground transition-colors group-hover:text-brand">
      <Translate text={title} />
    </span>
    <div
      className={cn("h-4 relative overflow-hidden mt-0.5", compact && "hidden")}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div
            key="subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-1 whitespace-nowrap text-2xs font-semibold uppercase tracking-normal text-muted-foreground"
          >
            <Translate text={subtitle} />
          </motion.div>
        ) : (
          <motion.div
            key="return"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-1 whitespace-nowrap text-2xs font-bold uppercase tracking-normal text-brand"
          >
            <Translate text={returnText} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default BackButtonLabel;
