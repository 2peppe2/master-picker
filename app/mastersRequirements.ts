export type MasterRequirement = CreditsRequirements | CoursesRequirements;

export type CreditsRequirements  = {
  type: "G-level" | "A-level" | "Total";
  credits: number;
}
export type CoursesRequirements = {
  type: "Courses";
  courses: string[][];
}

export const MastersRequirements: Record<string, MasterRequirement[]> = {
  "AI" : [
    { type: "A-level", credits: 30 },
    { type: "G-level", credits: 36 },
    { type: "Total", credits: 180 },
  ],

  "ALGO": [
    { type: "A-level", credits: 30 },
    { type: "G-level", credits: 36 },
    {type : "Courses", courses: [["TATA64", "TDDD08", "TDDD20", "TDDE34"]]},
    { type: "Total", credits: 180 },
  ],
  "IND": [
    { type: "A-level", credits: 30 },
    { type: "Total", credits: 180 },
  ],
  "MED" : [
    { type: "A-level", credits: 30 },
    { type: "G-level", credits: 36 },
    { type: "Total", credits: 180 },
  ],
  "GAMES" : [
    { type: "A-level", credits: 30 },
    { type: "G-level", credits: 36 },
    { type: "Total", credits: 180 },
  ],
  "SOFT" : [
    { type: "A-level", credits: 30 },
    { type: "Total", credits: 180 },
  ],
  "SECURE" : [
    { type: "G-level", credits: 12 }, // Min 2 courses in profile
    { type: "Total", credits: 180 },
  ],



    
};