
export type Course = {
  courseCode: string;
  courseName: string;
  period: string;
  block: number
  credits: number;
  level: string;
  link: string;
  mastersPrograms: string[];
}

export const COURSES: Record<string, Course> = {
  // --- Shared across multiple specialisations ---
  "TDDE02": {
    courseCode: "TDDE02",
    courseName: "Software Entrepreneurship",
    period: "HT2",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE02/ht-2026",
    mastersPrograms: ["GAMES", "IND", "LARGE"]
  },
  "TBMI19": {
    courseCode: "TBMI19",
    courseName: "Medical Information Systems",
    period: "HT1/HT2",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TBMI19/ht-2026",
    mastersPrograms: ["AI", "MED"]
  },
  "TSIT02": {
    courseCode: "TSIT02",
    courseName: "Computer Security",
    period: "HT2",
    block: 2,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TSIT02/ht-2026",
    mastersPrograms: ["PROG", "SECURE", "MED"]
  },
  "TSIT03": {
    courseCode: "TSIT03",
    courseName: "Cryptology",
    period: "HT1",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TSIT03/ht-2026",
    mastersPrograms: ["PROG", "SECURE"]
  },
  "TGTU99": {
    courseCode: "TGTU99",
    courseName: "Ethical Issues in AI",
    period: "HT1/HT2",
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TGTU99/ht-2026",
    mastersPrograms: ["AI"]
  },
  "TDDD08": {
    courseCode: "TDDD08",
    courseName: "Logic Programming",
    period: "HT1",
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD08/ht-2026",
    mastersPrograms: ["AI", "PROG"]
  },
  "TSKS33": {
    courseCode: "TSKS33",
    courseName: "Complex Networks and Big Data",
    period: "HT2",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TSKS33/ht-2026",
    mastersPrograms: ["AI", "PROG"]
  },
  "TSBB06": {
    courseCode: "TSBB06",
    courseName: "Multidimensional Signal Analysis",
    period: "HT1/HT2",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TSBB06/ht-2026",
    mastersPrograms: ["AI"]
  },

  // --- AI and Machine Learning ---
  "TSBB08": {
    courseCode: "TSBB08",
    courseName: "Digital Image Processing",
    period: "HT1",
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TSBB08/ht-2026",
    mastersPrograms: ["AI"]
  },
  "TDDE01": {
    courseCode: "TDDE01",
    courseName: "Machine Learning",
    period: "HT2",
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE01/ht-2026",
    mastersPrograms: ["AI"]
  },

  // --- Computer Games Programming ---
  "TDDD53": {
    courseCode: "TDDD53",
    courseName: "Advanced Interaction Design",
    period: "HT1",
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD53/ht-2026",
    mastersPrograms: ["GAMES", "MED"]
  },
  "TDDD23": {
    courseCode: "TDDD23",
    courseName: "Design and Programming of Computer Games",
    period: "HT1",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD23/ht-2026",
    mastersPrograms: ["GAMES"]
  },
  "TDDC73": {
    courseCode: "TDDC73",
    courseName: "Interaction Programming",
    period: "HT2",
    block: 1,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TDDC73/ht-2026",
    mastersPrograms: ["GAMES"]
  },

  // --- Industrial Economics ---
  "TEAE01": {
    courseCode: "TEAE01",
    courseName: "Industrial Economics, Basic Course",
    period: "HT1",
    block: 2,
    credits: 6,
    level: "G1F",
    link: "https://studieinfo.liu.se/en/kurs/TEAE01/ht-2026",
    mastersPrograms: ["IND"]
  },
  "TEIO32": {
    courseCode: "TEIO32",
    courseName: "Project Management and Organization",
    period: "HT1/HT2",
    block: 3,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TEIO32/ht-2026",
    mastersPrograms: ["IND"]
  },
  "TDDC34": {
    courseCode: "TDDC34",
    courseName: "Technical, Economic and Societal Evaluation of IT-products",
    period: "HT2",
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDC34/ht-2026",
    mastersPrograms: ["IND", "LARGE"]
  },

  // --- Large Scale Software Engineering ---
  "TDDE45": {
    courseCode: "TDDE45",
    courseName: "Software Design and Construction",
    period: "HT1",
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE45/ht-2026",
    mastersPrograms: ["LARGE"]
  },
  "TDDD04": {
    courseCode: "TDDD04",
    courseName: "Software Testing",
    period: "HT1",
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD04/ht-2026",
    mastersPrograms: ["LARGE"]
  },

  // --- Medical Informatics ---
  "TBME04": {
    courseCode: "TBME04",
    courseName: "Anatomy and Physiology",
    period: "HT1",
    block: 3,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TBME04/ht-2026",
    mastersPrograms: ["MED"]
  },
  "TBME03": {
    courseCode: "TBME03",
    courseName: "Biochemistry and Cell Biology",
    period: "HT2",
    block: 2,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TBME03/ht-2026",
    mastersPrograms: ["MED"]
  },
  "TBMI04": {
    courseCode: "TBMI04",
    courseName: "eHealth: Aims and Applications",
    period: "HT2",
    block: 2,//TODO this is 4 as well?
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TBMI04/ht-2026",
    mastersPrograms: ["MED"]
  },

  // --- Programming and Algorithms ---
  "TDDE66": {
    courseCode: "TDDE66",
    courseName: "Compiler Construction",
    period: "HT2",
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE66/ht-2026",
    mastersPrograms: ["PROG"]
  },

  // --- Secure Systems ---
  "TDDE74": {
    courseCode: "TDDE74",
    courseName: "Humans in Cybersecurity",
    period: "HT2",
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE74/ht-2026",
    mastersPrograms: ["SECURE"]
  }
};

