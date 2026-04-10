"use server";

import { groupsPrisma } from "@/lib/groupsPrisma";
import { Prisma } from "@/prisma/generated/groups-client/client";
import { revalidatePath } from "next/cache";

export interface AddGroupMemberInput {
  groupId: string;
  name: string;
  scheduleUrl: string;
}

export interface AddGroupMemberResult {
  success: boolean;
  fieldErrors?: {
    name?: string;
    scheduleUrl?: string;
  };
  formError?: string;
}

export async function addGroupMember({
  groupId,
  name,
  scheduleUrl,
}: AddGroupMemberInput): Promise<AddGroupMemberResult> {
  const trimmedGroupId = groupId.trim();
  const trimmedName = name.trim();
  const trimmedScheduleUrl = scheduleUrl.trim();

  if (!trimmedGroupId) {
    return {
      success: false,
      formError: "Invalid group.",
    };
  }

  const fieldErrors: AddGroupMemberResult["fieldErrors"] = {};

  if (!trimmedName) {
    fieldErrors.name = "Enter your name.";
  }

  try {
    new URL(trimmedScheduleUrl);
  } catch {
    fieldErrors.scheduleUrl = "Enter a valid schedule URL.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    };
  }

  try {
    await groupsPrisma.groupMemberSchedule.create({
      data: {
        groupId: trimmedGroupId,
        name: trimmedName,
        scheduleUrl: trimmedScheduleUrl,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        fieldErrors: {
          name: "That name is already used in this group.",
        },
      };
    }

    return {
      success: false,
      formError: "Could not add the schedule. Please try again.",
    };
  }

  revalidatePath(`/group/${trimmedGroupId}`);

  return { success: true };
}
