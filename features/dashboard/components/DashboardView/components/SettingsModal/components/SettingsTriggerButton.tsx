"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import { ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FC } from "react";

type SettingsTriggerButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  isOpen: boolean;
};

const SettingsTriggerButton: FC<SettingsTriggerButtonProps> = ({
  isOpen,
  ...props
}) => {
  const translate = useCommonTranslate();

  return (
    <Button
      {...props}
      variant="ghost"
      // The label is icon-only below the md breakpoint, so the button needs a
      // name of its own rather than relying on the text beside the icon.
      aria-label={translate("settings")}
      // Matches the share button and the master badges in landscape; the ::after
      // holds the tap target at 32px while the box shrinks to line up.
      data-density-exempt
      className={cn(
        "cursor-pointer ml-auto px-2 md:px-4 h-10 gap-1 md:gap-2",
        "hover:bg-accent hover:text-accent-foreground",
        "landscape-phone:relative landscape-phone:h-8",
        "landscape-phone:after:absolute landscape-phone:after:inset-x-0",
        "landscape-phone:after:-inset-y-1.5 landscape-phone:after:content-['']",
      )}
    >
      <Settings className="w-4 h-4" />
      <span className="text-sm font-medium hidden md:inline">
        <Translate text="settings" />
      </span>
      <ChevronDown
        className={cn(
          "w-3 h-3 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </Button>
  );
};

export default SettingsTriggerButton;
