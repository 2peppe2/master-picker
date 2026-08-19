"use client";

import LandingClientContent from "./components/LandingClientContent";
import type { LandingClientPageProps } from "./types";
import { LandingFormLoading } from "@/features/landing/components/LandingLoading";
import { FC, Suspense } from "react";

const LandingClientPage: FC<LandingClientPageProps> = (props) => (
  <Suspense fallback={<LandingFormLoading />}>
    <LandingClientContent {...props} />
  </Suspense>
);

export type { LandingPageProgram } from "./types";
export default LandingClientPage;
