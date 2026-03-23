"use client";

import Translate from "@/common/components/translate/Translate";
import { SearchX } from "lucide-react";
import { FC } from "react";


const EmptyCourseState: FC = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 text-muted-foreground animate-in fade-in duration-300">
    <div className="bg-muted/50 p-4 rounded-full mb-4">
      <SearchX className="h-8 w-8 opacity-60" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">
      <Translate text="no_courses_found" />
    </h3>
    <p className="text-sm mt-2 max-w-[250px]">
      <Translate text="try_adjusting_your_filters_or_search_terms" />
    </p>
  </div>
);

export default EmptyCourseState;
