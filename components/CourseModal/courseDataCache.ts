import { DataCourseStatistic, getCourseStatistic } from "liu-tentor-package"
export const fetchPromiseCache = new Map<string, DataCourseStatistic>();

export async function fetchCourseData(courseCode: string): Promise<DataCourseStatistic> {
  if (!fetchPromiseCache.has(courseCode)) {
    const course = await getCourseStatistic(courseCode) as DataCourseStatistic;

    fetchPromiseCache.set(courseCode, course);
  }

  return fetchPromiseCache.get(courseCode) as DataCourseStatistic;
}
