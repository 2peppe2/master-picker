import {
  BriefcaseBusiness,
  Joystick,
  Pi,
  Pill,
  Server,
  Shield,
  Sparkles,
  TrafficCone,
  Bot,
  ScanEye,
  Cpu,
  CircuitBoard,
  Microchip,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  BriefcaseBusiness,
  Joystick,
  Pi,
  Pill,
  Server,
  Shield,
  Sparkles,
  TrafficCone,
  Bot,
  ScanEye,
  Cpu,
  CircuitBoard,
  Microchip,
};

export function getLucideIcon(name: string | null): LucideIcon {
  return ICONS[name ?? "TrafficCone"];
}
