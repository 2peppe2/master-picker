import type { LandingQueryState } from "@/common/navigation/queryState";

export interface LandingPageProgram {
  program: string;
  name: string;
  shortname: string;
  years: {
    year: number;
    masters: {
      program: string;
      name: string | null;
    }[];
  }[];
}

export interface LandingClientPageProps {
  programs: LandingPageProgram[];
  initialSelection: LandingQueryState;
}
