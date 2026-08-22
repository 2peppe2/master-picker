import type { MasterName } from "../../prisma/json_types";

/**
 * Only icons registered in lib/iconRegistry.ts may be emitted: getLucideIcon
 * returns undefined for anything else and the badge would crash at render.
 * Icons outside this set are collected as suggestions instead.
 */
const REGISTERED_ICONS = [
  "BriefcaseBusiness",
  "Joystick",
  "Pi",
  "Pill",
  "Server",
  "Shield",
  "Sparkles",
  "TrafficCone",
  "Bot",
  "ScanEye",
  "Cpu",
  "CircuitBoard",
  "Microchip",
  "Zap",
  "Layers",
] as const;

const REGISTERED = new Set<string>(REGISTERED_ICONS);

/** First matching rule wins, so put the specific keywords first. */
const ICON_RULES: [RegExp, string][] = [
  [/machine learning|artificial intelligence|\bai\b|data science|machine intelligence/i, "Sparkles"],
  // "Strategic Management and Control" is a business profile, not a control
  // engineering one; claim it before the rule below sees the word "control".
  [/strategic management|management and control|styrning/i, "BriefcaseBusiness"],
  [/autonomous|robot|mechatronic|control|reglerteknik/i, "Bot"],
  [/vision|image|signal|visuali/i, "ScanEye"],
  [/security|secure|safety/i, "Shield"],
  [/game|play/i, "Joystick"],
  [/micro ?electronic|nano|photonic|quantum|semiconductor/i, "Microchip"],
  [/embedded|circuit|hardware|electronic|electrical|elektroteknik|radar|communication/i, "CircuitBoard"],
  [/processor|computer system|architecture|chip/i, "Cpu"],
  // Before the software rule: "computational mathematics" is a maths profile.
  [/mathemat|statistic|optimi|financial|finance|physics/i, "Pi"],
  [/software|programming|algorithm|computing|computation|computer science|datateknik|theoretical/i, "Server"],
  [/energy|power|environment|sustainab|climate/i, "Zap"],
  [/medic|health|bio|protein|chemi|molecul|pharma/i, "Pill"],
  [/business|management|market|econom|logistic|supply chain|entrepreneur|strateg|quality|production|operations/i, "BriefcaseBusiness"],
  // 6CKTS is a transport program: without this its profiles fall through to the
  // generic fallback. Below the business rule, so "supply chain" stays there.
  [/traffic|transport|smart cit|urban|infrastructure/i, "TrafficCone"],
  [/material|mechanic|manufactur|construction|product development|design|aeronaut|vehicle/i, "TrafficCone"],
];

const PALETTE = [
  "violet",
  "sky",
  "emerald",
  "amber",
  "rose",
  "indigo",
  "lime",
  "cyan",
  "fuchsia",
  "orange",
  "blue",
  "purple",
  "pink",
  "teal",
  "red",
  "yellow",
  "green",
  "slate",
];

const style = (color: string) =>
  `bg-${color}-100 text-${color}-800 border-${color}-300 dark:bg-${color}-900/20 dark:text-${color}-300`;

export interface MasterIconSuggestion {
  masterId: string;
  name: string;
  suggested: string;
  usedInstead: string;
}

function pickIcon(name: string): { icon: string; suggestion?: string } {
  const match = ICON_RULES.find(([pattern]) => pattern.test(name));
  if (!match) return { icon: "Layers" };
  const [, icon] = match;
  if (REGISTERED.has(icon)) return { icon };
  return { icon: "Layers", suggestion: icon };
}

export function buildMasters(
  specializations: Map<string, string>,
): { masters: MasterName[]; iconSuggestions: MasterIconSuggestion[] } {
  const iconSuggestions: MasterIconSuggestion[] = [];
  const ids = [...specializations.keys()].sort();

  const masters = ids.map((id, index) => {
    const name = specializations.get(id)!;
    const { icon, suggestion } = pickIcon(name);
    if (suggestion) {
      iconSuggestions.push({ masterId: id, name, suggested: suggestion, usedInstead: icon });
    }
    return {
      id,
      name,
      icon,
      // Cycling the palette by index keeps colours distinct within a program.
      style: style(PALETTE[index % PALETTE.length]),
    };
  });

  return { masters, iconSuggestions };
}
