import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Course } from "@/app/dashboard/page";
import { ArrowRight } from "lucide-react";
import { FC, useCallback } from "react";

interface ContinueButtonProps {
  disabled?: boolean;
  bachelorCourses: Course[];
}

const ContinueButton: FC<ContinueButtonProps> = ({
  bachelorCourses,
  disabled,
}) => {
  const { setInitialCourses } = useScheduleMutators();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = useCallback(() => {
    setInitialCourses({
      entries: bachelorCourses.map((course) => ({
        course,
        occasion: course.CourseOccasion[0],
      })),
    });

    router.push(`/dashboard?${searchParams.toString()}`);
  }, [bachelorCourses, router, searchParams, setInitialCourses]);

  return (
    <Button className="mt-4" onClick={handleClick} disabled={disabled}>
      Continue
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default ContinueButton;
