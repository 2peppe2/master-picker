"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SettingsTriggerButton from "./SettingsTriggerButton";
import SettingsContent from "./SettingsContent";
import { SettingsViewProps } from "../types";
import { FC } from "react";

const SettingsLarge: FC<SettingsViewProps> = ({ isOpen, onOpenChange }) => (
  <Popover open={isOpen} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <SettingsTriggerButton isOpen={isOpen} />
    </PopoverTrigger>

    <PopoverContent align="end" className="p-0 overflow-hidden w-64">
      <SettingsContent />
    </PopoverContent>
  </Popover>
);

export default SettingsLarge;
