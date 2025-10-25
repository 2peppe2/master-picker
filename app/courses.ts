export type Course = {
  code: string;
  name: string;
  semester: number;
  period: number[];
  block: number;
  credits: number;
  level: string;
  link: string;
  mastersPrograms: string[];
  dependencies?: string[][];
};

export const COURSES: Record<string, Course> = {
  "TAOP33": {
    code: "TAOP33",
    name: "Combinatorial Optimization, Introductory Course",
    semester: 7,
    period: [1],
    block: 2,
    credits: 4,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TAOP33/ht-2026",
    mastersPrograms: ["ALGO"]
  },
  "TAMS43": {
    code: "TAMS43",
    name: "Probability Theory and Bayesian Networks",
    semester: 7,
    period: [1],
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TAMS43/ht-2026",
    mastersPrograms: ["AI"]
  },
  "TANA21": {
    code: "TANA21",
    name: "Scientific Computing",
    semester: 7,
    period: [1],
    block: 3,
    credits: 6,
    level: "G1F",
    link: "https://studieinfo.liu.se/en/kurs/TANA21/ht-2026",
    mastersPrograms: []
  },
  "TATA55": {
    code: "TATA55",
    name: "Abstract Algebra",
    semester: 7,
    period: [1, 2],
    block: 3,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TATA55/ht-2026",
    mastersPrograms: ["ALGO"]
  },
  "TBME03": {
    code: "TBME03",
    name: "Biochemistry and Cell Biology",
    semester: 7,
    period: [2],
    block: 2,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TBME03/ht-2026",
    mastersPrograms: ["MED"]
  },
  "TBME04": {
    code: "TBME04",
    name: "Anatomy and Physiology",
    semester: 7,
    period: [1],
    block: 3,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TBME04/ht-2026",
    mastersPrograms: ["MED"]
  },
  "TBMI04": {
    code: "TBMI04",
    name: "eHealth: Aims and Applications",
    semester: 7,
    period: [2],
    block: 2,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TBMI04/ht-2026",
    mastersPrograms: ["MED"]
  },
  "TBMI19": {
    code: "TBMI19",
    name: "Medical Information Systems",
    semester: 7,
    period: [1, 2],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TBMI19/ht-2026",
    mastersPrograms: ["AI", "MED"]
  },
  "TDDD04": {
    code: "TDDD04",
    name: "Software Testing",
    semester: 7,
    period: [1],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD04/ht-2026",
    mastersPrograms: ["SOFT"]
  },
  "TDDD07": {
    code: "TDDD07",
    name: "Real Time Systems",
    semester: 7,
    period: [2],
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD07/ht-2026",
    mastersPrograms: []
  },
  "TDDD08": {
    code: "TDDD08",
    name: "Logic Programming",
    semester: 7,
    period: [1],
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD08/ht-2026",
    mastersPrograms: ["AI", "ALGO"]
  },
  "TDDD23": {
    code: "TDDD23",
    name: "Design and Programming of Computer Games",
    semester: 7,
    period: [1],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD23/ht-2026",
    mastersPrograms: ["GAMES"]
  },
  "TDDD34": {
    code: "TDDC34",
    name: "Technical, Economic and Societal Evaluation of IT-products",
    semester: 7,
    period: [2],
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDC34/ht-2026",
    mastersPrograms: ["IND", "SOFT"]
  },
  "TDDD38": {
    code: "TDDD38",
    name: "Advanced Programming in C++",
    semester: 7,
    period: [1, 2],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD38/ht-2026",
    mastersPrograms: ["ALGO", "SOFT"]
  },
  "TDDD43": {
    code: "TDDD43",
    name: "Advanced Data Models and Databases",
    semester: 7,
    period: [1, 2],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD43/ht-2026",
    mastersPrograms: ["SOFT"]
  },
  "TDDD49": {
    code: "TDDD49",
    name: "Programming in C# and .NET Framework",
    semester: 7,
    period: [2],
    block: 3,
    credits: 4,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TDDD49/ht-2026",
    mastersPrograms: ["SOFT"]
  },
  "TDDD53": {
    code: "TDDD53",
    name: "Advanced Interaction Design",
    semester: 7,
    period: [1],
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD53/ht-2026",
    mastersPrograms: ["GAMES", "MED"]
  },
  "TDDD56": {
    code: "TDDD56",
    name: "Multicore and GPU Programming",
    semester: 7,
    period: [2],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDD56/ht-2026",
    mastersPrograms: ["ALGO"]
  },
  "TDDE01": {
    code: "TDDE01",
    name: "Machine Learning",
    semester: 7,
    period: [2],
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE01/ht-2026",
    mastersPrograms: ["AI"]
  },
  "TDDE02": {
    code: "TDDE02",
    name: "Software Entrepreneurship",
    semester: 7,
    period: [2],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE02/ht-2026",
    mastersPrograms: ["IND", "SOFT", "GAMES"]
  },
  "TDDE45": {
    code: "TDDE45",
    name: "Software Design and Construction",
    semester: 7,
    period: [1],
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE45/ht-2026",
    mastersPrograms: ["SOFT"]
  },
  "TDDE66": {
    code: "TDDE66",
    name: "Compiler Construction",
    semester: 7,
    period: [2],
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE66/ht-2026",
    mastersPrograms: ["ALGO"]
  },
  "TDDE74": {
    code: "TDDE74",
    name: "Humans in Cybersecurity",
    semester: 7,
    period: [2],
    block: 4,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TDDE74/ht-2026",
    mastersPrograms: ["SECURE"]
  },
  "TSIT02": {
    code: "TSIT02",
    name: "Computer Security",
    semester: 7,
    period: [2],
    block: 2,
    credits: 6,
    level: "G2F",
    link: "https://studieinfo.liu.se/en/kurs/TSIT02/ht-2026",
    mastersPrograms: ["SECURE", "MED", "ALGO"]
  },
  "TSIT03": {
    code: "TSIT03",
    name: "Cryptology",
    semester: 7,
    period: [1],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TSIT03/ht-2026",
    mastersPrograms: ["SECURE", "ALGO"]
  },
  "TSKS33": {
    code: "TSKS33",
    name: "Complex Networks and Big Data",
    semester: 7,
    period: [2],
    block: 2,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TSKS33/ht-2026",
    mastersPrograms: ["AI", "ALGO"]
  },
  "TGTU99": {
    code: "TGTU99",
    name: "Ethical Issues in AI",
    semester: 7,
    period: [1, 2],
    block: 1,
    credits: 6,
    level: "A1N",
    link: "https://studieinfo.liu.se/en/kurs/TGTU99/ht-2026",
    mastersPrograms: ["AI"]
  }
};