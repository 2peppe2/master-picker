"use client";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import SettingsTriggerButton from "./SettingsTriggerButton";
import { Button } from "@/components/ui/button";
import SettingsPhoneContent from "./SettingsPhoneContent";
import { SettingsViewProps } from "../types";
import { X } from "lucide-react";
import { FC } from "react";

const SettingsSmall: FC<SettingsViewProps> = ({ isOpen, onOpenChange }) => {
  const translate = useCommonTranslate();

  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange}>
      <BottomSheetTrigger asChild>
        <SettingsTriggerButton isOpen={isOpen} />
      </BottomSheetTrigger>

      <BottomSheetContent className="overflow-hidden">
        {/* Radix warns unless the content has a description it can point
            aria-describedby at; the title carries the visible meaning. */}
        <BottomSheetDescription className="sr-only">
          <Translate text="settings" />
        </BottomSheetDescription>
        <div className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-2">
          <BottomSheetTitle className="flex-1 text-lg font-semibold tracking-tight">
            <Translate text="settings" />
          </BottomSheetTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={translate("close")}
            onClick={() => onOpenChange(false)}
            className="-mr-2 -mt-1 size-10 shrink-0 text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-6">
          <SettingsPhoneContent />
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default SettingsSmall;
