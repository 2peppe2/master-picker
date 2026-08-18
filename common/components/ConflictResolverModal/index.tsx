"use client";

import { useCourseContlictResolver } from "./hooks/useCourseContlictResolver";
import { usePrefersSheet } from "@/common/hooks/useResponsiveLayout";
import ConflictResolverSmall from "./ConflictResolverSmall";
import ConflictResolverLarge from "./ConflictResolverLarge";
import { ConflictResolverProps } from "./types";
import { FC, useCallback } from "react";

export type { ConflictData } from "./types";

const ConflictResolverModal: FC<ConflictResolverProps> = (props) => {
  const { conflictData } = props;
  const prefersSheet = usePrefersSheet();
  const { resolveConflict } = useCourseContlictResolver();

  const handleResolution = useCallback(
    (type: "replace" | "extra") => (e: React.MouseEvent) => {
      e.preventDefault();
      resolveConflict({ ...conflictData, type });
      props.setOpen(false);
    },
    [resolveConflict, conflictData, props],
  );

  if (conflictData.collisions.length === 0) return null;

  return prefersSheet ? (
    <ConflictResolverSmall {...props} onResolve={handleResolution} />
  ) : (
    <ConflictResolverLarge {...props} onResolve={handleResolution} />
  );
};

export default ConflictResolverModal;
