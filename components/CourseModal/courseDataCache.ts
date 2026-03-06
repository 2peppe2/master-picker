export type Grade = {
  grade: string;
  gradeOrder: number;
  quantity: number;
};

export type Module = {
  moduleCode: string;
  date: string;
  grades: Grade[];
};

export type EvaluationReport = {
  reportId: number;
  reportDate: string;
  scores: Record<string, number>;
};

export type CourseData = {
  courseCode: string;
  courseNameSwe: string;
  courseNameEng: string;
  lastUpdatedTimestamp: string;
  modules: Module[];
  evaluationReports?: EvaluationReport[];
};

export const fetchPromiseCache = new Map<string, Promise<CourseData>>();

export async function fetchCourseData(courseCode: string): Promise<CourseData> {
  if (!fetchPromiseCache.has(courseCode)) {
    const request = fetch(
      `https://liutentor.lukasabbe.com/api/courses/${courseCode}`
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch course data");
      return res.json();
    });

    fetchPromiseCache.set(courseCode, request);
  }

  return fetchPromiseCache.get(courseCode) as Promise<CourseData>;
}
