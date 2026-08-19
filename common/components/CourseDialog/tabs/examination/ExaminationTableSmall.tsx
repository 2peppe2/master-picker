import { cn } from "@/lib/utils";
import ExaminationSectionHeader from "./components/ExaminationSectionHeader";
import ExaminationCardSmall from "./components/ExaminationCardSmall";
import Translate from "@/common/components/translate/Translate";
import { ExaminationTableViewProps } from "./ExaminationTable.types";
import { FC } from "react";

const ExaminationTableSmall: FC<ExaminationTableViewProps> = ({
  examination,
  getLatestStats,
  isLoading,
  onNavigateToStatistics,
}) => (
  <div className="space-y-3 text-foreground">
    <section>
      <ExaminationSectionHeader count={examination.length} />
      <div
        className={cn(
          "space-y-2",
          "landscape-phone:grid landscape-phone:grid-cols-2",
          "landscape-phone:gap-2 landscape-phone:space-y-0",
        )}
      >
        {examination.length === 0 ? (
          <div
            className={cn(
              "rounded-2xl bg-muted/40 p-5 text-center text-sm",
              "text-muted-foreground landscape-phone:col-span-full",
            )}
          >
            <Translate text="_course_no_examinations" />
          </div>
        ) : (
          examination.map((exam) => (
            <ExaminationCardSmall
              key={exam.module}
              exam={exam}
              stats={getLatestStats(exam.module)}
              isLoading={isLoading}
              onNavigateToStatistics={() =>
                onNavigateToStatistics(exam.module)
              }
            />
          ))
        )}
      </div>
    </section>
  </div>
);

export default ExaminationTableSmall;
