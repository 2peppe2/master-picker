import { cn } from "@/lib/utils";
import Translate from "@/common/components/translate/Translate";
import MobileOccasionCard from "./MobileOccasionCard";
import OccasionConflictResolver from "./OccasionConflictResolver";
import { useOccasionTableState } from "../hooks/useOccasionTableState";
import { OccasionTableProps } from "./OccasionTable.types";
import { FC } from "react";

const OccasionTableSmall: FC<OccasionTableProps> = ({
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
      <div
        className={cn(
          "space-y-2",
          "landscape-phone:grid landscape-phone:grid-cols-2",
          "landscape-phone:gap-2 landscape-phone:space-y-0",
        )}
      >
        {state.occasions.length === 0 ? (
          <div
            className={cn(
              "rounded-2xl bg-muted/40 p-5 text-center text-sm",
              "text-muted-foreground landscape-phone:col-span-full",
            )}
          >
            <Translate text="_course_no_occasions" />
          </div>
        ) : (
          state.occasions.map((occasion) => (
            <MobileOccasionCard
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
