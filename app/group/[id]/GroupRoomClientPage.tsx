"use client";

import MasterProvider from "@/app/(store)/MasterAtomContext";
import { Master } from "@/app/dashboard/page";
import GroupPageHero from "../components/GroupPageHero";
import GroupPageShell from "../components/GroupPageShell";
import GroupMembersCard from "./components/GroupMembersCard";
import RoomActionsCard from "./components/RoomActionsCard";
import { GroupMemberCardData } from "./memberScheduleData";
import { Users } from "lucide-react";
import { Provider as JotaiProvider, atom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { FC } from "react";

const groupMastersAtom = atom<Record<string, Master>>({});

interface GroupRoomClientPageProps {
  groupId: string;
  members: GroupMemberCardData[];
  masters: Record<string, Master>;
}

const GroupRoomContent: FC<GroupRoomClientPageProps> = ({
  groupId,
  members,
  masters,
}) => {
  useHydrateAtoms([[groupMastersAtom, masters]]);

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
        <GroupMembersCard groupId={groupId} members={members} />
      </div>
    </GroupPageShell>
  );
};

const GroupRoomClientPage: FC<GroupRoomClientPageProps> = (props) => (
  <JotaiProvider>
    <MasterProvider atom={groupMastersAtom}>
      <GroupRoomContent {...props} />
    </MasterProvider>
  </JotaiProvider>
);

export default GroupRoomClientPage;
