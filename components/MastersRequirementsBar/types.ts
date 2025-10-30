export type TotalCreditsRequirements = {
  type: "Total";
  credits: number;
};

export type ALevelRequirements = {
  type: "A-level";
  credits: number;
};

export type GLevelRequirements = {
  type: "G-level";
  credits: number;
};

export type CoursesRequirements = {
  type: "Courses";
  courses: string[];
};

export type MasterRequirement =
  | TotalCreditsRequirements
  | ALevelRequirements
  | GLevelRequirements
  | CoursesRequirements;

export type Master =
  | "AI"
  | "ALGO"
  | "IND"
  | "MED"
  | "GAMES"
  | "SOFT"
  | "SECURE";

export type MasterRequirements = Record<Master, MasterRequirement[]>;
