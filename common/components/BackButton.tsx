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
}

const BackButton: FC<BackButtonProps> = ({
  href = "/",
  title,
  subtitle,
  returnText,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group flex items-center gap-2 py-2 pr-4 rounded-xl transition-all duration-300",
        "active:scale-95 active:bg-accent/10",
        className,
      )}
    >
      <BackButtonIcon isHovered={isHovered} />
      <BackButtonLabel
        title={title}
        subtitle={subtitle}
        returnText={returnText}
        isHovered={isHovered}
      />
    </Link>
  );
};

export default BackButton;

interface BackButtonIconProps {
  isHovered: boolean;
}

const BackButtonIcon: FC<BackButtonIconProps> = ({ isHovered }) => (
  <div className="relative flex items-center justify-center size-10 shrink-0">
    <AnimatePresence mode="popLayout">
      {!isHovered ? (
        <motion.div
          key="logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0, x: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center size-12"
        >
          <Image
            src="/logo/mp_logo_icon.svg"
            alt="Logo"
            width={44}
            height={38}
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
          className="flex items-center justify-center size-9 bg-[#00C8B3]/10 rounded-xl"
        >
          <ChevronLeft className="size-7 text-[#00C8B3]" />
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
}

const BackButtonLabel: FC<BackButtonLabelProps> = ({
  title,
  subtitle,
  returnText,
  isHovered,
}) => (
  <div className="flex flex-col min-w-0 pr-2">
    <span className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-[#00C8B3]">
      <Translate text={title} />
    </span>

    <div className="h-4 relative overflow-hidden mt-0.5">
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div
            key="subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-[10px] tracking-wider font-semibold uppercase text-muted-foreground flex items-center gap-1"
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
            className="text-[10px] tracking-wider font-bold uppercase text-[#00C8B3] flex items-center gap-1"
          >
            <Translate text={returnText} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
