import type { Slot } from "@/features/dashboard/state/schedule/types";

export const getPeriodCredits = (periods: Slot[][], periodNumber: number) => {
  const coursesInPeriod = new Map(
    periods[periodNumber]
      .filter((course): course is NonNullable<Slot> => course !== null)
      .map((course) => [course.code, course]),
  );

  return [...coursesInPeriod.values()].reduce((total, course) => {
    const scheduledPeriodCount = periods.filter((period) =>
      period.some((slot) => slot?.code === course.code),
    ).length;

    return total + course.credits / scheduledPeriodCount;
  }, 0);
};

export const formatCredits = (credits: number) =>
  Number.isInteger(credits)
    ? String(credits)
    : String(Number(credits.toFixed(2)));
