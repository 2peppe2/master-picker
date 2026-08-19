"use client";

import { usePrefersSheet } from "@/common/hooks/useResponsiveLayout";
import ConflictResolverSmall from "./ConflictResolverSmall";
import ConflictResolverLarge from "./ConflictResolverLarge";
import { ConflictResolverProps } from "./types";
import { FC } from "react";

export type { ConflictData } from "./types";

const ConflictResolverModal: FC<ConflictResolverProps> = (props) => {
  const { conflictData } = props;
  const prefersSheet = usePrefersSheet();
  const handleResolution =
    (type: "replace" | "extra") => (e: React.MouseEvent) => {
      e.preventDefault();
      props.onResolve(type);
      props.setOpen(false);
    };

  if (conflictData.collisions.length === 0) return null;

  return prefersSheet ? (
    <ConflictResolverSmall {...props} onResolve={handleResolution} />
  ) : (
    <ConflictResolverLarge {...props} onResolve={handleResolution} />
  );
};

export default ConflictResolverModal;
