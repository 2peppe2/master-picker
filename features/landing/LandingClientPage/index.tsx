"use client";

import LandingClientContent, {
  LandingClientPageProps,
} from "./components/LandingClientContent";
import { LandingFormLoading } from "@/features/landing/components/LandingLoading";
import { FC, Suspense } from "react";

const LandingClientPage: FC<LandingClientPageProps> = (props) => (
  <Suspense fallback={<LandingFormLoading />}>
    <LandingClientContent {...props} />
  </Suspense>
);

export type { LandingPageProgram } from "./components/LandingClientContent";
export default LandingClientPage;
