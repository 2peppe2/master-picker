export const EXAMINATION_TYPES = [
  "written_exam",
  "computer_exam",
  "lab",
  "assignment",
  "project",
  "oral",
  "seminar",
  "optional_test",
] as const;

export type ExaminationType = (typeof EXAMINATION_TYPES)[number];

/**
 * LiU module codes grouped into the categories students think in. The codes
 * are matched as prefixes, so numbered and lettered variants (TEN1, TENB,
 * UPGA) land in the same category. The prefixes are mutually unambiguous.
 */
const MODULE_PREFIXES: Record<ExaminationType, string[]> = {
  written_exam: ["TEN"],
  computer_exam: ["DAT", "DAK", "DIT"],
  lab: ["LAB"],
  assignment: ["UPG", "HEM"],
  project: ["PRA", "PROJ"],
  oral: ["MUN"],
  seminar: ["BAS", "MOM", "SEM", "AUSK", "OPPO"],
  optional_test: ["KTR"],
};

export const isExaminationType = (value: string): value is ExaminationType =>
  EXAMINATION_TYPES.includes(value as ExaminationType);

/** Returns null for module codes outside the known categories. */
export const getExaminationType = (
  moduleCode: string,
): ExaminationType | null => {
  const normalized = moduleCode.trim().toUpperCase();

  return (
    EXAMINATION_TYPES.find((type) =>
      MODULE_PREFIXES[type].some((prefix) => normalized.startsWith(prefix)),
    ) ?? null
  );
};

export const getCourseExaminationTypes = (
  examinations: { module: string }[],
): Set<ExaminationType> => {
  const types = new Set<ExaminationType>();

  examinations.forEach(({ module }) => {
    const type = getExaminationType(module);
    if (type !== null) types.add(type);
  });

  return types;
};
