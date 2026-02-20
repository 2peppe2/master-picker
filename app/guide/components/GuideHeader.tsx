import { MasterBadge } from "@/components/MasterBadge";
import { FC } from "react";

interface GuideHeaderProps {
  selectedMaster: string;
}
const GuideHeader: FC<GuideHeaderProps> = ({ selectedMaster }) => {
  return (
    <header className="flex flex-col gap-2">
      <MasterBadge name={selectedMaster} title={true} style="text-base" />
      <h1 className="text-3xl font-semibold tracking-tight">
        {"Great choice! Let's set up your schedule."}
      </h1>
      <div className="mt-4 max-w-2xl">
        <p className="text-base text-muted-foreground">
          {
            "Required courses are added automatically. This master requires you to choose between several course options. Dont worry, you can change your choices later if you change your mind!"
          }
        </p>
      </div>
    </header>
  );
};

export default GuideHeader;