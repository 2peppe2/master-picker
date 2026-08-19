"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { FC } from "react";

interface BackButtonIconProps {
  isHovered: boolean;
  compact: boolean;
}

const BackButtonIcon: FC<BackButtonIconProps> = ({ isHovered, compact }) => (
  <div
    className={cn(
      "relative flex items-center justify-center shrink-0",
      compact ? "size-8" : "size-10",
    )}
  >
    <AnimatePresence mode="popLayout">
      {!isHovered ? (
        <motion.div
          key="logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0, x: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "flex items-center justify-center",
            compact ? "size-9" : "size-12",
          )}
        >
          <Image
            src="/logo/mp_logo_icon.svg"
            alt="Logo"
            width={compact ? 32 : 44}
            height={compact ? 28 : 38}
            style={{ height: "auto" }}
            className="shrink-0"
          />
        </motion.div>
      ) : (
        <motion.div
          key="arrow"
          initial={{ scale: 0.5, opacity: 0, x: 10 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "flex items-center justify-center bg-brand/10 rounded-xl",
            compact ? "size-7" : "size-9",
          )}
        >
          <ChevronLeft
            className={cn("text-brand", compact ? "size-5" : "size-7")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default BackButtonIcon;
