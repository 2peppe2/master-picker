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

      <div className="space-y-2 sm:hidden">
        {occasions.length === 0 ? (
          <div
            className={cn(
              "rounded-2xl bg-muted/40 p-5 text-center text-sm",
              "text-muted-foreground",
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

      <div className="hidden sm:block">
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
