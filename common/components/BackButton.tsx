"use client";

import Translate from "@/common/components/translate/Translate";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  title: string;
  subtitle: string;
  returnText: string;
  className?: string;
  /**
   * Drops the subtitle row and shrinks the logo for headers that have no
   * vertical room to spare. The subtitle only doubles as a hover affordance,
   * which touch devices never see anyway.
   */
  compact?: boolean;
}

const BackButton: FC<BackButtonProps> = ({
  href = "/",
  title,
  subtitle,
  returnText,
  className,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group flex min-w-0 items-center gap-2 rounded-xl pr-2 transition-all duration-300",
        compact ? "py-1" : "py-2",
        "active:scale-95 active:bg-accent/10",
        className,
      )}
    >
      <BackButtonIcon isHovered={isHovered} compact={compact} />
      <BackButtonLabel
        title={title}
        subtitle={subtitle}
        returnText={returnText}
        isHovered={isHovered}
        compact={compact}
      />
    </Link>
  );
};

export default BackButton;

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
            "flex items-center justify-center bg-[#00C8B3]/10 rounded-xl",
            compact ? "size-7" : "size-9",
          )}
        >
          <ChevronLeft
            className={cn("text-[#00C8B3]", compact ? "size-5" : "size-7")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

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
    <span className="truncate whitespace-nowrap text-sm font-bold text-foreground transition-colors group-hover:text-[#00C8B3]">
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
            className="flex items-center gap-1 whitespace-nowrap text-2xs font-bold uppercase tracking-normal text-[#00C8B3]"
          >
            <Translate text={returnText} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
