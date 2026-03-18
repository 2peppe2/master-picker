"use client";

export const chartConfig = {
  quantity: { label: "Students" },
};

/**
 * Returns a constant color mapped to each grade.
 * - Grade 5: Emerald Green
 * - Grade 4: Standard Green
 * - Grade 3: Lime Green
 * - Grade U: Red
 */
export const getConstantColor = (grade: string): string => {
  switch (grade.toUpperCase()) {
    case "5":
      return "hsl(160, 84%, 39%)"; // Emerald Green
    case "4":
      return "hsl(142, 71%, 45%)"; // Standard Green
    case "3":
      return "hsl(84, 81%, 44%)"; // Lime Green
    case "VG":
      return "hsl(160, 84%, 39%)";
    case "G":
      return "hsl(142, 71%, 45%)";
    case "U":
      return "hsl(0, 84%, 60%)";
    default:
      return "hsl(220, 10%, 50%)";
  }
};

/**
 * Priorities for sorting grades sequentially from highest down to failing.
 */
export const GRADE_PRIORITY: Record<string, number> = {
  "5": 1,
  "4": 2,
  "3": 3,
  VG: 4,
  G: 5,
  U: 6,
};
