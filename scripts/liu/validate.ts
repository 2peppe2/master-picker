import type { RequirementUnion } from "./parseRequirements";

/**
 * Structural check against data/schemas/master_requirement.schema.json.
 * Kept as plain code rather than pulling in a JSON Schema validator: the schema
 * has three shapes and this way the script has no runtime dependency.
 */
export function validateRequirements(
  requirements: Record<string, RequirementUnion[]>,
): string[] {
  const errors: string[] = [];

  const CREDIT_TYPES = new Set([
    "CREDITS_TOTAL",
    "CREDITS_MASTER_TOTAL",
    "CREDITS_PROFILE_TOTAL",
    "CREDITS_ADVANCED_PROFILE",
    "CREDITS_ADVANCED_MASTER",
  ]);

  for (const [master, list] of Object.entries(requirements)) {
    list.forEach((requirement, index) => {
      const where = `${master}[${index}]`;

      if (CREDIT_TYPES.has(requirement.type)) {
        const { credits } = requirement as { credits: number };
        if (!Number.isInteger(credits) || credits < 0) {
          errors.push(`${where}: ${requirement.type} needs a non-negative integer credits`);
        }
        return;
      }

      if (requirement.type === "CREDITS_MAIN_FIELD_TOTAL") {
        if (!Number.isInteger(requirement.credits) || requirement.credits < 0) {
          errors.push(`${where}: CREDITS_MAIN_FIELD_TOTAL needs a non-negative integer credits`);
        }
        if (!Array.isArray(requirement.fields) || requirement.fields.length === 0) {
          errors.push(`${where}: CREDITS_MAIN_FIELD_TOTAL needs at least one field`);
        }
        return;
      }

      if (requirement.type === "COURSE_SELECTION") {
        if (!Number.isInteger(requirement.minCount) || requirement.minCount < 1) {
          errors.push(`${where}: COURSE_SELECTION needs minCount >= 1`);
        }
        if (!Array.isArray(requirement.courses) || requirement.courses.length === 0) {
          errors.push(`${where}: COURSE_SELECTION needs at least one course`);
        }
        // Linköping codes are four letters and two digits (TDDD27); Norrköping
        // uses three and three (TNM094).
        for (const code of requirement.courses ?? []) {
          if (!/^[A-Z]{3,4}\d{2,3}$/.test(code)) {
            errors.push(`${where}: "${code}" does not match the schema's ^[A-Z]{3,4}\\d{2,3}$`);
          }
        }
        if (requirement.minCount > requirement.courses.length) {
          errors.push(
            `${where}: minCount ${requirement.minCount} exceeds the ${requirement.courses.length} courses listed`,
          );
        }
        return;
      }

      errors.push(`${where}: unknown requirement type "${(requirement as { type: string }).type}"`);
    });
  }

  return errors;
}
