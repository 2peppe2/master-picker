import { getLucideIcon } from "@/lib/iconRegistry";
import { FC } from "react";

type MasterIconProps = {
  iconName: string|null;
  className?: string;
};

export const MasterIcon: FC<MasterIconProps> = ({iconName, className}) => {
  const Icon = getLucideIcon(iconName);
  return <Icon className={className} size={16} />
}