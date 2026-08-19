import ExaminationSectionHeader from "./components/ExaminationSectionHeader";
import ExaminationTableHeader from "./components/ExaminationTableHeader";
import ExaminationTableRow from "./components/ExaminationTableRow";
import { Table, TableBody } from "@/components/ui/table";
import { ExaminationTableViewProps } from "./ExaminationTable.types";
import { FC } from "react";

const ExaminationTableLarge: FC<ExaminationTableViewProps> = ({
  examination,
  getLatestStats,
  isLoading,
  onNavigateToStatistics,
}) => (
  <div className="space-y-3 text-foreground">
    <section>
      <ExaminationSectionHeader count={examination.length} />
      <Table>
        <ExaminationTableHeader />
        <TableBody>
          {examination.map((exam) => (
            <ExaminationTableRow
              key={exam.module}
              exam={exam}
              getLatestStats={getLatestStats}
              isLoading={isLoading}
              onNavigateToStatistics={onNavigateToStatistics}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  </div>
);

export default ExaminationTableLarge;
