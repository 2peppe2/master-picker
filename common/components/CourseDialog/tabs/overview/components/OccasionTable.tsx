"use client";

import { cn } from "@/lib/utils";

import { useOccasionCollisions } from "@/features/dashboard/state/schedule/hooks/useScheduleQueries";
import { useToRelativeSemester } from "@/common/hooks/useToRelativeSemester";
import { sortCourseOccasionsByPreferredSemesters } from "@/common/courseOccasionOrdering";
import ConflictResolverModal from "@/common/components/ConflictResolverModal";
import { useCourseContlictResolver } from "@/common/components/ConflictResolverModal/hooks/useCourseContlictResolver";
import { Course, CourseOccasion } from "@/common/types";
import Translate from "@/common/components/translate/Translate";
import { Table, TableBody } from "@/components/ui/table";
import OccasionTableHeader from "./OccasionTableHeader";
import OccasionTableRow from "./OccasionTableRow";
import MobileOccasionCard from "./MobileOccasionCard";
import { useIsTouchLayout } from "@/common/hooks/useResponsiveLayout";
import { FC, useMemo, useState } from "react";

interface OccasionTableProps {
  course: Course;
  showAdd: boolean;
  preferredSemesters?: number[];
}

const OccasionTable: FC<OccasionTableProps> = ({
  course,
  showAdd,
  preferredSemesters,
}) => {
  const [selectedOccasion, setSelectedOccasion] =
    useState<CourseOccasion | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const isTouchLayout = useIsTouchLayout();

  const getOccasionCollisions = useOccasionCollisions();
  const { executeAdd } = useCourseContlictResolver();
  const toRelativeSemester = useToRelativeSemester();

  const occasions = useMemo(() => {
    return sortCourseOccasionsByPreferredSemesters({
      occasions: course.CourseOccasion,
      preferredSemesters: preferredSemesters ?? [],
      toRelativeSemester,
    });
  }, [course.CourseOccasion, preferredSemesters, toRelativeSemester]);

  const hasRecommendedMaster = occasions.some(
    (occasion) => occasion.recommendedMaster.length > 0,
  );

  return (
    <>
      {selectedOccasion && (
        <ConflictResolverModal
          open={alertOpen}
          setOpen={setAlertOpen}
          conflictData={{
            strategy: "button",
            collisions: getOccasionCollisions({
              occasion: selectedOccasion,
            }).filter((collision) => collision.code !== course.code),
            course,
            occasion: selectedOccasion,
          }}
        />
      )}

      {/* Not `sm:` — a landscape phone is wide enough to pass a width check
          and would get the desktop table inside a very short dialog. */}
      <div
        className={cn(
          "space-y-2",
          // Two per row in landscape: the cards are short and the panel is
          // wide, so a single column left half the width empty.
          "landscape-phone:grid landscape-phone:grid-cols-2",
          "landscape-phone:gap-2 landscape-phone:space-y-0",
          !isTouchLayout && "hidden",
        )}
      >
        {occasions.length === 0 ? (
          <div
            className={cn(
              "rounded-2xl bg-muted/40 p-5 text-center text-sm",
              "text-muted-foreground landscape-phone:col-span-full",
            )}
          >
            <Translate text="_course_no_occasions" />
          </div>
        ) : (
          occasions.map((occasion) => {
            const collisions = getOccasionCollisions({ occasion }).filter(
              (collision) => collision.code !== course.code,
            );

            return (
              <MobileOccasionCard
                key={occasion.id}
                occasion={occasion}
                showAdd={showAdd}
                hasCollision={collisions.length > 0}
                onAdd={() => {
                  if (collisions.length > 0) {
                    setSelectedOccasion(occasion);
                    setAlertOpen(true);
                    return;
                  }

                  executeAdd({ course, occasion, strategy: "button" });
                }}
              />
            );
          })
        )}
      </div>

      <div className={cn(isTouchLayout && "hidden")}>
        <Table>
          <OccasionTableHeader
            showRecommendedMaster={hasRecommendedMaster}
            showAdd={showAdd}
          />
          <TableBody>
            {occasions.map((occasion) => (
              <OccasionTableRow
                key={occasion.id}
                occasion={occasion}
                course={course}
                showRecommendedMaster={hasRecommendedMaster}
                setAlertOpen={setAlertOpen}
                setSelectedOccasion={setSelectedOccasion}
                showAdd={showAdd}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default OccasionTable;
