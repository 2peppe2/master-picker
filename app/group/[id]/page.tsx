import GroupRoomClientPage from "./GroupRoomClientPage";
import { groupsPrisma } from "@/lib/groupsPrisma";
import { getGroupMemberCardData } from "./memberScheduleData";
import { FC } from "react";

interface GroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

const GroupPage: FC<GroupPageProps> = async ({ params }) => {
  const { id: groupId } = await params;
  const members = await groupsPrisma.groupMemberSchedule.findMany({
    where: { groupId },
    orderBy: {
      name: "asc",
    },
  });
  const memberCards = await getGroupMemberCardData(members);

  return <GroupRoomClientPage groupId={groupId} members={memberCards} />;
};

export default GroupPage;
