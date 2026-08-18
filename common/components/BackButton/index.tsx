"use client";

import BackButtonIcon from "./components/BackButtonIcon";
import BackButtonLabel from "./components/BackButtonLabel";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BackButtonProps {
  href?: string;
  title: string;
  subtitle: string;
  returnText: string;
  className?: string;
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
