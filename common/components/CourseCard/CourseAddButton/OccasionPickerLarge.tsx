"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CourseOccasionPicker from "../CourseOccasionPicker";
import { OccasionPickerViewProps } from "./types";
import AddButton from "./components/AddButton";
import { FC } from "react";

const OccasionPickerLarge: FC<OccasionPickerViewProps> = ({
  course,
  isOpen,
  onOpenChange,
  preferredSemesters,
  onSelect,
}) => (
  <Popover open={isOpen} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <AddButton courseCode={course.code} />
    </PopoverTrigger>
    <PopoverContent
      side="left"
      align="start"
      sideOffset={10}
      className="w-64 p-0"
    >
      <CourseOccasionPicker
        course={course}
        preferredSemesters={preferredSemesters}
        onSelect={onSelect}
      />
    </PopoverContent>
  </Popover>
);

export default OccasionPickerLarge;
