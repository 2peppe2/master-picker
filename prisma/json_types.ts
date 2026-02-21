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
  occasions: {
    year: number;
    semester: string;
    ht_or_vt: string;
    periods: {
      period: number;
      blocks: number[];
    }[];
    recommended_masters: string[];
  }[];
}

interface MasterName {
  id: string;
  name: string;
  icon: string;
  style: string;
}

interface CreditRequirement {
  type: "A-level" | "G-level" | "Total";
  credits: number;
}

interface CoursesRequirement {
  type: "Courses";
  courses: string[];
}

type MasterRequirement = CreditRequirement | CoursesRequirement;

interface MasterRequirements {
  [masterId: string]: MasterRequirement[];
}

export type {
  Program,
  ProgramYear,
  CourseDetail,
  CourseDetails,
  Course,
  MasterName,
  MasterRequirements,
};
