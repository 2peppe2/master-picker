"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import EvaluateErrorState from "./EvaluateErrorState";

interface EvaluationErrorBoundaryProps {
  children: ReactNode;
}

interface EvaluationErrorBoundaryState {
  hasError: boolean;
}

class EvaluationErrorBoundary extends Component<
  EvaluationErrorBoundaryProps,
  EvaluationErrorBoundaryState
> {
  state: EvaluationErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): EvaluationErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Failed to render course evaluation", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <EvaluateErrorState hasError />;
    }

    return this.props.children;
  }
}

export default EvaluationErrorBoundary;
