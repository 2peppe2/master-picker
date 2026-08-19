import OccasionConflictResolver from "./OccasionConflictResolver";
import OccasionTableHeader from "./OccasionTableHeader";
import OccasionTableRow from "./OccasionTableRow";
import { useOccasionTableState } from "../hooks/useOccasionTableState";
import { OccasionTableProps } from "./OccasionTable.types";
import { Table, TableBody } from "@/components/ui/table";
import { FC } from "react";

const OccasionTableLarge: FC<OccasionTableProps> = ({
  course,
  showAdd,
  preferredSemesters,
}) => {
  const state = useOccasionTableState({ course, preferredSemesters });

  return (
    <>
      <OccasionConflictResolver
        course={course}
        occasion={state.selectedOccasion}
        collisions={
          state.selectedOccasion
            ? state.getOtherCourseCollisions(state.selectedOccasion)
            : []
        }
        open={state.alertOpen}
        onOpenChange={state.setAlertOpen}
      />
      <Table>
        <OccasionTableHeader
          showRecommendedMaster={state.hasRecommendedMaster}
          showAdd={showAdd}
        />
        <TableBody>
          {state.occasions.map((occasion) => (
            <OccasionTableRow
              key={occasion.id}
              occasion={occasion}
              course={course}
              showRecommendedMaster={state.hasRecommendedMaster}
              setAlertOpen={state.setAlertOpen}
              setSelectedOccasion={state.setSelectedOccasion}
              showAdd={showAdd}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OccasionTableLarge;
