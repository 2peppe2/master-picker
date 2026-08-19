import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";
import EvaluateErrorState from "./EvaluateErrorState";

const EvaluationFallback: FC<FallbackProps> = () => (
  <EvaluateErrorState hasError />
);

export default EvaluationFallback;
