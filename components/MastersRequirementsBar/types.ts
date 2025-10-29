export type CreditsRequirements = {
  type: "G-level" | "A-level" | "Total";
  credits: number;
};

export type CoursesRequirements = {
  type: "Courses";
  courses: string[][]; // [(TATA24 ∨ TATA22) ∧ (TDDE23)]
};

export type MasterRequirement = CreditsRequirements | CoursesRequirements;

export type Master =
  | "AI"
  | "ALGO"
  | "IND"
  | "MED"
  | "GAMES"
  | "SOFT"
  | "SECURE";

export type MasterRequirements = Record<Master, MasterRequirement[]>;
