"use client";

import GroupPageHero from "../components/GroupPageHero";
import GroupPageShell from "../components/GroupPageShell";
import GroupMembersCard from "./components/GroupMembersCard";
import RoomActionsCard from "./components/RoomActionsCard";
import { GroupMemberCardData } from "./memberScheduleData";
import { Users } from "lucide-react";
import { FC } from "react";

interface GroupRoomClientPageProps {
  groupId: string;
  members: GroupMemberCardData[];
}

const GroupRoomClientPage: FC<GroupRoomClientPageProps> = ({
  groupId,
  members,
}) => {
  return (
    <GroupPageShell maxWidthClassName="max-w-5xl">
      <div className="w-full space-y-8">
        <GroupPageHero
          badgeLabel="Group room"
          badgeIcon={Users}
          title="Your study group room is ready."
          description={
            members.length > 0
              ? `There ${members.length === 1 ? "is" : "are"} ${members.length} ${
                  members.length === 1 ? "person" : "people"
                } in this room.`
              : "Bring your group together in one shared space."
          }
        />
        <RoomActionsCard groupId={groupId} />
        <GroupMembersCard members={members} />
      </div>
    </GroupPageShell>
  );
};

export default GroupRoomClientPage;
