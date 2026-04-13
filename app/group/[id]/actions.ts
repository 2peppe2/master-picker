"use server";

import { groupsPrisma } from "@/lib/groupsPrisma";
import { Prisma } from "@/prisma/generated/groups-client/client";
import { revalidatePath } from "next/cache";

interface AddGroupMemberInput {
  groupId: string;
  name: string;
  scheduleUrl: string;
}

export interface GroupMemberMutationResult {
  success: boolean;
  fieldErrors?: {
    name?: string;
    scheduleUrl?: string;
  };
  formError?: string;
}

interface ValidatedGroupMemberInput {
  groupId: string;
  name: string;
  scheduleUrl: string;
}

interface ValidateGroupMemberInput {
  groupId: string;
  name: string;
  scheduleUrl: string;
}

interface UpdateGroupMemberInput extends AddGroupMemberInput {
  memberId: string;
}

interface DeleteGroupMemberInput {
  groupId: string;
  memberId: string;
}

const validateGroupMemberInput = ({
  groupId,
  name,
  scheduleUrl,
}: ValidateGroupMemberInput):
  | { success: true; data: ValidatedGroupMemberInput }
  | { success: false; result: GroupMemberMutationResult } => {
  const trimmedGroupId = groupId.trim();
  const trimmedName = name.trim();
  const trimmedScheduleUrl = scheduleUrl.trim();

  if (!trimmedGroupId) {
    return {
      success: false,
      result: {
        success: false,
        formError: "Invalid group.",
      },
    };
  }

  const fieldErrors: GroupMemberMutationResult["fieldErrors"] = {};

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
      result: {
        success: false,
        fieldErrors,
      },
    };
  }

  return {
    success: true,
    data: {
      groupId: trimmedGroupId,
      name: trimmedName,
      scheduleUrl: trimmedScheduleUrl,
    },
  };
};

export async function addGroupMember({
  groupId,
  name,
  scheduleUrl,
}: AddGroupMemberInput): Promise<GroupMemberMutationResult> {
  const validated = validateGroupMemberInput({
    groupId,
    name,
    scheduleUrl,
  });

  if (!validated.success) {
    return validated.result;
  }

  try {
    await groupsPrisma.groupMemberSchedule.create({
      data: {
        groupId: validated.data.groupId,
        name: validated.data.name,
        scheduleUrl: validated.data.scheduleUrl,
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

  revalidatePath(`/group/${validated.data.groupId}`);

  return { success: true };
}

export async function updateGroupMember({
  memberId,
  groupId,
  name,
  scheduleUrl,
}: UpdateGroupMemberInput): Promise<GroupMemberMutationResult> {
  const trimmedMemberId = memberId.trim();
  if (!trimmedMemberId) {
    return {
      success: false,
      formError: "Invalid member.",
    };
  }

  const validated = validateGroupMemberInput({
    groupId,
    name,
    scheduleUrl,
  });

  if (!validated.success) {
    return validated.result;
  }

  try {
    await groupsPrisma.groupMemberSchedule.update({
      where: {
        id: trimmedMemberId,
      },
      data: {
        name: validated.data.name,
        scheduleUrl: validated.data.scheduleUrl,
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
      formError: "Could not update the member. Please try again.",
    };
  }

  revalidatePath(`/group/${validated.data.groupId}`);

  return { success: true };
}

export async function deleteGroupMember({
  groupId,
  memberId,
}: DeleteGroupMemberInput): Promise<{ success: boolean; formError?: string }> {
  const trimmedGroupId = groupId.trim();
  const trimmedMemberId = memberId.trim();

  if (!trimmedGroupId || !trimmedMemberId) {
    return {
      success: false,
      formError: "Invalid member.",
    };
  }

  try {
    await groupsPrisma.groupMemberSchedule.delete({
      where: {
        id: trimmedMemberId,
      },
    });
  } catch {
    return {
      success: false,
      formError: "Could not remove the member. Please try again.",
    };
  }

  revalidatePath(`/group/${trimmedGroupId}`);

  return { success: true };
}
