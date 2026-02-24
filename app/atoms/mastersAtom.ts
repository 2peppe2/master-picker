import { Master } from "../dashboard/page";
import { atom } from "jotai";

export const mastersAtom = atom<Record<string, Master>>({});

/**
 * Validates the total amount of credits at the Advanced (A) level
 * across the entire Master's degree (usually requiring at least 60 HP).
 */
interface CreditsAdvancedMaster {
  type: "CREDITS_ADVANCED_MASTER";
  credits: number;
}

/**
 * Validates that a specific amount of credits within the chosen Profile
 * are at the Advanced (A) level.
 */
interface CreditsAdvancedProfile {
  type: "CREDITS_ADVANCED_PROFILE";
  credits: number;
}

/**
 * Validates the total credit breadth of the profile.
 * This includes both Basic (G) and Advanced (A) level courses.
 * Example: A profile might require 36 HP total, regardless of level.
 */
interface CreditsProfileTotal {
  type: "CREDITS_PROFILE_TOTAL";
  credits: number;
}

/**
 * Validates the total credits for the entire degree (typically 120 HP).
 */
interface CreditsMasterTotal {
  type: "CREDITS_MASTER_TOTAL";
  credits: number;
}

interface CreditsTotal {
  type: "CREDITS_TOTAL";
  credits: number;
}

/**
 * Validates a selection of specific courses.
 * Used for mandatory courses (minCount: 1, one course in list)
 * or elective groups (e.g., "pick 2 of 5").
 */
interface CourseSelection {
  type: "COURSE_SELECTION";
  minCount: number;
  courses: string[];
}

export type RequirementUnion =
  | CreditsAdvancedMaster
  | CreditsAdvancedProfile
  | CreditsProfileTotal
  | CreditsMasterTotal
  | CourseSelection
  | CreditsTotal;
