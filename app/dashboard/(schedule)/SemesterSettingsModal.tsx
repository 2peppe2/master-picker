import { useScheduleMutators } from "@/app/atoms/schedule/hooks/useScheduleMutators";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FC } from "react";

interface SemesterSettingsModalProps {
  semester: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SemesterSettingsModal: FC<SemesterSettingsModalProps> = ({
  semester,
  isOpen,
  onOpenChange,
}) => {
  const { addBlockToSemester } = useScheduleMutators();

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 hover:bg-accent"
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="p-0 overflow-hidden w-64">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Semester settings
          </p>
        </div>

        <div className="p-1">
          <button
            onClick={() => {
              addBlockToSemester({ semester });
              onOpenChange(false);
            }}
            className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors group"
          >
            <div className="w-4 h-4 rounded border border-input flex items-center justify-center group-hover:border-muted-foreground transition-all">
              <Plus className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="font-medium text-foreground">
                Add extra block
              </span>
              <span className="text-[11px] text-muted-foreground">
                Extend available slots for this semester
              </span>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SemesterSettingsModal;
