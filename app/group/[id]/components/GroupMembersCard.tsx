import { Card, CardContent } from "@/components/ui/card";
import { GroupMemberCardData } from "../memberScheduleData";
import { ListChecks, Users } from "lucide-react";
import { FC } from "react";
import MemberScheduleCard from "./MemberScheduleCard";

interface GroupMembersCardProps {
  groupId: string;
  members: GroupMemberCardData[];
}

const GroupMembersCard: FC<GroupMembersCardProps> = ({ groupId, members }) => (
  <Card className="overflow-hidden border-border/70 bg-card/80 py-0 shadow-xl backdrop-blur-sm">
    <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ListChecks className="size-4" />
        Group members
      </div>
    </div>
    

    <CardContent className="px-6 pb-8 pt-2">
      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-center">
          <Users className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            No schedules added yet
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add your schedule to get this group started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {members.map((member) => (
            <MemberScheduleCard key={member.id} groupId={groupId} member={member} />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default GroupMembersCard;
