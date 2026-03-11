import { SearchX } from "lucide-react";
import { FC } from "react";

interface EmptyCourseStateProps {
  title: string;
  description: string;
}

const EmptyCourseState: FC<EmptyCourseStateProps> = ({
  title,
  description,
}) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 text-muted-foreground animate-in fade-in duration-300">
    <div className="bg-muted/50 p-4 rounded-full mb-4">
      <SearchX className="h-8 w-8 opacity-60" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="text-sm mt-2 max-w-[250px]">{description}</p>
  </div>
);

export default EmptyCourseState;
