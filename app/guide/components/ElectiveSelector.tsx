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
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, FC } from "react";
import { Check, X } from "lucide-react";

interface ElectiveSelectorProps {
  index: number;
  electiveCourses: CourseRequirements[0];
  selection: string | null;
  onSelectionChange: (courseCode: string | null) => void;
}

const ElectiveSelector: FC<ElectiveSelectorProps> = ({
  index,
  electiveCourses,
  selection,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="mt-8" key={`choice-group-${index}`}>
      <Collapsible
        open={isOpen}
        onOpenChange={(setOpen) => {
          setIsOpen(setOpen);
        }}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">Pick one</Badge>
              <CardTitle>Elective course {index + 1}</CardTitle>
            </div>

            <div
              className={
                "flex items-center gap-4 text-sm font-medium text-muted-foreground "
              }
            >
              {selection ? `Selected ${selection}` : "Select to continue"}

              <CollapsibleTrigger asChild>
                <Button
                  size="icon"
                  className={`cursor-pointer h-10 w-10 rounded-4xl ${isOpen ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700" : "bg-red-500/10 hover:bg-red-500/20 text-red-700"}`}
                  onClick={() => setIsOpen((open) => !open)}
                  disabled={!selection}
                >
                  {isOpen ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CardDescription>
            This group has {electiveCourses.courses.length} options, but you
            only need to select one.
          </CardDescription>
        </CardHeader>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent className="py-4">
            {/* Use radio-group mental model: one choice, click anywhere on the card */}
            <div
              role="radiogroup"
              aria-label="Elective course selection"
              className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4"
            >
              {electiveCourses.courses.map((courseEntry) => {
                const course = normalizeCourse(courseEntry.course);
                const courseCode = course.code;
                const isSelected = selection === courseCode;

                return (
                  <button
                    key={courseCode}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      onSelectionChange(isSelected ? null : courseCode)
                    }
                    className={cn(
                      "group relative w-full rounded-2xl border p-4 text-left transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "hover:-translate-y-[1px] hover:border-foreground/20 hover:shadow-sm",
                      isSelected
                        ? "border-emerald-300 bg-emerald-50/60"
                        : "border-muted bg-background",
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition",
                            isSelected
                              ? "border-emerald-600"
                              : "border-muted-foreground/40",
                          )}
                          aria-hidden
                        >
                          {isSelected ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                          ) : null}
                        </span>

                        <div className="leading-tight">
                          <div className="text-sm font-semibold">
                            {courseCode}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Click to select
                          </div>
                        </div>
                      </div>
                    </div>
                    <CourseCard course={course} variant="selectable" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ElectiveSelector;
