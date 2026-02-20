import { Badge } from "@/components/ui/badge";
import type { CourseRequirements } from "../page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { normalizeCourse } from "@/app/courseNormalizer";
import { cn } from "@/lib/utils";

interface ElectiveSelectorProps {
  index: number;
  electiveCourses: CourseRequirements[0];
  selection: string | null;
  onSelectionChange: (courseCode: string | null) => void;
}

const ElectiveSelector: React.FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selection,
  onSelectionChange,
}) => {
  return (
    <Card className="mt-8" key={`choice-group-${index}`}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex flex-wrap items-center gap-3">
               <Badge variant="outline">Pick one</Badge>
              <CardTitle>Elective course {index + 1}</CardTitle>
            </div>
            
          
          <div
            className={cn(
              "text-sm font-medium",
              selection ? "text-emerald-700" : "text-muted-foreground",
            )}
          >
            {selection ? `Selected ${selection}` : "No selection"}
          </div>
        </div>
        <CardDescription>
              This group has {electiveCourses.courses.length} options, but you only need to select one.
            </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {electiveCourses.courses.map((courseEntry) => {
            const normalizedCourse = normalizeCourse(courseEntry.course);
            const courseCode = normalizedCourse.code;
            const isSelected = selection === courseCode;

            return (
              <div
                key={courseCode}
                className={cn(
                  "rounded-2xl border p-4 transition",
                  isSelected
                    ? "border-emerald-300 bg-emerald-50/60"
                    : "border-muted bg-background hover:border-foreground/20",
                )}
              >
                <div className="space-y-4">
                  <CourseCard course={normalizedCourse} variant="noAdd" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "secondary"}
                      onClick={() => {
                        onSelectionChange(isSelected ? null : courseCode);
                      }}
                      aria-pressed={isSelected}
                    >
                      {isSelected ? "Selected" : `Select ${courseCode}`}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectiveSelector;
