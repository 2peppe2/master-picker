import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpen } from "lucide-react";
import { FC } from "react";
import AddScheduleDialog from "./AddScheduleDialog";
import InviteFriendsButton from "./InviteFriendsButton";

interface RoomActionsCardProps {
  groupId: string;
}

const RoomActionsCard: FC<RoomActionsCardProps> = ({ groupId }) => (
  <Card className="overflow-hidden border-border/70 bg-card/80 py-0 shadow-xl backdrop-blur-sm">
    <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <DoorOpen className="size-4" />
        Group actions
      </div>
    </div>
    <CardHeader className="px-6 pt-6">
      <CardTitle className="text-center text-2xl tracking-tight">
        Manage your room
      </CardTitle>
    </CardHeader>

    <CardContent className="px-6 pb-8 pt-2">
      <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
        <AddScheduleDialog />
        <InviteFriendsButton groupId={groupId} />
      </div>
    </CardContent>
  </Card>
);

export default RoomActionsCard;
