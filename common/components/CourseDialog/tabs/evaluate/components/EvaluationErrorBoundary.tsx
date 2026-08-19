"use client";

import { ErrorBoundary } from "react-error-boundary";
import type { FC, ReactNode } from "react";
import EvaluationFallback from "./EvaluationFallback";

interface EvaluationErrorBoundaryProps {
  children: ReactNode;
  courseCode: string;
}

const EvaluationErrorBoundary: FC<EvaluationErrorBoundaryProps> = ({
  children,
  courseCode,
}) => (
  <ErrorBoundary
    FallbackComponent={EvaluationFallback}
    onError={(error, info) =>
      console.error("Failed to render course evaluation", error, info)
    }
    resetKeys={[courseCode]}
  >
    {children}
  </ErrorBoundary>
);

export default EvaluationErrorBoundary;
