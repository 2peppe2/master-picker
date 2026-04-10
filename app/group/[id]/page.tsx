import { Master } from "@/app/dashboard/page";
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
  const masters = Object.fromEntries(
    memberCards.flatMap((member) =>
      member.mastersWithRequirements.map((master) => [
        master.master,
        {
          master: master.master,
          name: master.name,
          icon: master.icon,
          style: master.style,
        } satisfies Master,
      ]),
    ),
  );

  return (
    <GroupRoomClientPage
      groupId={groupId}
      members={memberCards}
      masters={masters}
    />
  );
};

export default GroupPage;
