import GroupRoomClientPage from "./GroupRoomClientPage";
import { FC } from "react";

interface GroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

const GroupPage: FC<GroupPageProps> = async ({ params }) => {
  const { id: groupId } = await params;

  return <GroupRoomClientPage groupId={groupId} />;
};

export default GroupPage;
