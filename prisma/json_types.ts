interface Program {
  id: string;
  name: string;
  shortname: string;
  years: { id: number; year: number }[];
}

interface ProgramYear {
  id: number;
  year: number;
}

interface CourseDetail {
  examiner: string;
  prerequisites: string;
  education_components: number[];
  examinations: {
    credits: number;
    module: string;
    name: string;
    scale?: string;
  }[];
}
type CourseDetails = { [courseCode: string]: CourseDetail };

interface Course {
  code: string;
  name: string;
  credits: number;
  level: string;
  link: string;
  ecv: string;
  program: string[];
  mastersPrograms: string[];
  occasions: CourseOccasion[];
}

interface CourseOccasion {
  year: number;
  semester: string;
  ht_or_vt: string;
  periods: {
    period: number;
    blocks: number[];
  }[];
  recommended_masters: string[];
}

interface MasterName {
  id: string;
  name: string;
  icon: string;
  style: string;
}

interface CreditsAdvancedMaster {
  type: "CREDITS_ADVANCED_MASTER"; // 30hp A-nivå i mastern
  credits: number;
}

interface CreditsAdvancedProfile {
  type: "CREDITS_ADVANCED_PROFILE"; // T.ex. DPAL: 30hp A-nivå i profilen
  credits: number;
}

interface CreditsProfileTotal {
  type: "CREDITS_PROFILE_TOTAL"; // T.ex. 36hp, 42hp eller 48hp i profilen
  credits: number;
}

interface CreditsMasterTotal {
  type: "CREDITS_MASTER_TOTAL"; // 120hp totalt i mastern
  credits: number;
}

interface CourseSelection {
  type: "COURSE_SELECTION"; // Obligatoriska eller valbara kurser
  minCount: number;
  courses: { courseCode: string }[];
}

type RequirementUnion =
  | CreditsAdvancedMaster
  | CreditsAdvancedProfile
  | CreditsProfileTotal
  | CreditsMasterTotal
  | CourseSelection;

export type {
  Program,
  ProgramYear,
  CourseDetail,
  CourseDetails,
  Course,
  MasterName,
  CourseOccasion,
  RequirementUnion,
};
