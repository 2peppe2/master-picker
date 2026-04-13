import { DoorOpen } from "lucide-react";
import { FC } from "react";
import AddScheduleDialog from "./AddScheduleDialog";
import CompareSchedulesDialog from "../compare/CompareSchedulesDialog";
import type { GroupMemberCardData } from "../../memberScheduleData";
import InviteFriendsButton from "./InviteFriendsButton";

interface RoomActionsCardProps {
  groupId: string;
  members: GroupMemberCardData[];
}

const RoomActionsCard: FC<RoomActionsCardProps> = ({ groupId, members }) => (
  <div className="rounded-2xl border border-border/70 bg-background/70 p-3 shadow-sm backdrop-blur-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
        <DoorOpen className="size-4" />
        Room actions
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <AddScheduleDialog groupId={groupId} />
        <CompareSchedulesDialog members={members} />
        <InviteFriendsButton groupId={groupId} />
      </div>
    </div>
  </div>
);

export default RoomActionsCard;
