"use client";

import GroupPageHero from "../components/GroupPageHero";
import GroupPageShell from "../components/GroupPageShell";
import RoomActionsCard from "./components/RoomActionsCard";
import { Users } from "lucide-react";
import { FC } from "react";

interface GroupRoomClientPageProps {
  groupId: string;
}

const GroupRoomClientPage: FC<GroupRoomClientPageProps> = ({ groupId }) => {
  return (
    <GroupPageShell maxWidthClassName="max-w-5xl">
      <div className="w-full space-y-8">
        <GroupPageHero
          badgeLabel="Group room"
          badgeIcon={Users}
          title="Your study group room is ready."
          description="Bring your group together in one shared space."
        />
        <RoomActionsCard groupId={groupId} />
      </div>
    </GroupPageShell>
  );
};

export default GroupRoomClientPage;
