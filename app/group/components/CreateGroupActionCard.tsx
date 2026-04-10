import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, UserPlus } from "lucide-react";
import { FC } from "react";

interface CreateGroupActionCardProps {
  isPending: boolean;
  isDisabled: boolean;
  onCreateGroup: () => void;
}

const CreateGroupActionCard: FC<CreateGroupActionCardProps> = ({
  isPending,
  isDisabled,
  onCreateGroup,
}) => (
  <Card className="overflow-hidden border-border/70 bg-card/80 py-0 shadow-xl backdrop-blur-sm">
    <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <UserPlus className="size-4" />
        Start a shared room in one step
      </div>
    </div>

    <CardHeader className="px-6 pt-6">
      <CardTitle className="text-2xl tracking-tight">Create new group</CardTitle>
      <p className="text-sm leading-6 text-muted-foreground">
        Set up a group and jump straight into your shared room.
      </p>
    </CardHeader>

    <CardFooter className="flex flex-col gap-3 px-6 py-6">
      <Button
        size="lg"
        className="w-full"
        onClick={onCreateGroup}
        disabled={isDisabled}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
        Create group room
      </Button>
      <p className="text-center text-xs leading-5 text-muted-foreground">
        Invite your friends once the room is ready.
      </p>
    </CardFooter>
  </Card>
);

export default CreateGroupActionCard;
