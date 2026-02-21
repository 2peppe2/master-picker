import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/components/CourseCard";
import { normalizeCourse } from "@/app/courseNormalizer";
import { CourseRequirements } from "../page";
import { FC, useState } from "react";

interface CompulsoryCardSummaryProps {
  compulsoryCourses: CourseRequirements;
  compulsoryConfirmed: boolean;
  onConfirmChange: () => void;
}

const CompulsorySelector: FC<CompulsoryCardSummaryProps> = ({
  compulsoryCourses,
  compulsoryConfirmed,
  onConfirmChange,
}) => {
  const [isRequiredOpen, setRequiredOpen] = useState(true);

  if (compulsoryCourses.length === 0) {
    return null;
  }

  return (
    <Card className="mt-10">
      <Collapsible
        open={isRequiredOpen}
        onOpenChange={(setOpen) => {
          setRequiredOpen(setOpen);
        }}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-emerald-500/10 text-emerald-700">
                Auto-added
              </Badge>
              <CardTitle>Required courses</CardTitle>
            </div>

            <CollapsibleTrigger asChild>
              <Button
                size="icon"
                className={`cursor-pointer h-10 w-10 rounded-4xl ${compulsoryConfirmed ? "bg-red-500/10 hover:bg-red-500/20 text-red-700" : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700"}`}
                onClick={onConfirmChange}
              >
                {compulsoryConfirmed ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>
            These courses are mandatory and will be added automatically to your
            schedule.
          </CardDescription>
        </CardHeader>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 py-4">
              {compulsoryCourses.map((req) =>
                req.courses.map((courseEntry) => {
                  return (
                    <div key={courseEntry.course.code} className="space-y-3">
                      <CourseCard
                        course={normalizeCourse(courseEntry.course)}
                        variant="default"
                      />
                    </div>
                  );
                }),
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CompulsorySelector;
