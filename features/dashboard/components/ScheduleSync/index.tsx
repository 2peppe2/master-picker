"use client";

import { FC, Suspense } from "react";
import { useScheduleUrlSync } from "./hooks/useScheduleUrlSync";

interface ScheduleSyncProps {
  onHydrated?: () => void;
}

const ScheduleSyncInner: FC<ScheduleSyncProps> = ({ onHydrated }) => {
  useScheduleUrlSync({ onHydrated });

  return null;
};

const ScheduleSync: FC<ScheduleSyncProps> = ({ onHydrated }) => (
  <Suspense fallback={null}>
    <ScheduleSyncInner onHydrated={onHydrated} />
  </Suspense>
);

export default ScheduleSync;
