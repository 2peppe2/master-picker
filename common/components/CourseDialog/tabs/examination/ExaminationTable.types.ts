import { useLatestOriginalStats } from "./hooks/useLatestOriginalStats";
import { CourseExamination, CourseOccasion } from "@/common/types";

export interface ExaminationTableProps {
  examination: CourseExamination[];
  courseCode: string;
  occasions: CourseOccasion[];
  onNavigateToStatistics: (modCode?: string) => void;
}

export interface ExaminationTableViewProps
  extends Omit<ExaminationTableProps, "courseCode" | "occasions"> {
  getLatestStats: ReturnType<typeof useLatestOriginalStats>;
  isLoading: boolean;
}
