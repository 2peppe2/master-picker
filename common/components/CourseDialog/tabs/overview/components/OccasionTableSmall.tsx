import { cn } from "@/lib/utils";
import OccasionCardSmall from "./OccasionCardSmall";
import OccasionConflictResolver from "./OccasionConflictResolver";
import { useOccasionTableState } from "../hooks/useOccasionTableState";
import { OccasionTableProps } from "./OccasionTable.types";
import { FC } from "react";
import OccasionEmptyStateSmall from "../states/OccasionEmptyStateSmall";

const OccasionTableSmall: FC<OccasionTableProps> = ({
  course,
  showAdd,
  preferredSemesters,
  occasionActions,
}) => {
  const state = useOccasionTableState({ course, preferredSemesters, occasionActions });

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
        onResolve={state.handleResolveConflict}
      />
      <div
        className={cn(
          "space-y-2",
          "landscape-phone:grid landscape-phone:grid-cols-2",
          "landscape-phone:gap-2 landscape-phone:space-y-0",
        )}
      >
        {state.occasions.length === 0 ? (
          <OccasionEmptyStateSmall />
        ) : (
          state.occasions.map((occasion) => (
            <OccasionCardSmall
              key={occasion.id}
              occasion={occasion}
              showAdd={showAdd}
              hasCollision={
                state.getOtherCourseCollisions(occasion).length > 0
              }
              onAdd={() => state.handleAdd(occasion)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default OccasionTableSmall;
