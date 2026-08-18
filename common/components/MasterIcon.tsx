import { getLucideIcon } from "@/lib/iconRegistry";
import { createElement, FC } from "react";

type MasterIconProps = {
  iconName: string | null;
  className?: string;
};

export const MasterIcon: FC<MasterIconProps> = ({ iconName, className }) => {
  return createElement(getLucideIcon(iconName), { className, size: 16 });
};
