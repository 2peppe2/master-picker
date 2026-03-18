"use server";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HonorableMention {
  name: string;
  handle: string;
  description: string;
}

const HONORABLE_MENTIONS: HonorableMention[] = [
  {
    name: "Lukas",
    handle: "lukasabbe",
    description:
      "For help with LiU statistics and general support at the end of the project.",
  },
  {
    name: "Tristan",
    handle: "TristanTrille",
    description:
      "For the help with promoting the project and providing feedback.",
  },
];

const HonorableMentions = () => (
  <Card className="max-w-md border-dashed bg-gradient-to-br from-card via-card to-muted/40 gap-0">
    <CardHeader className="gap-2">
      <Badge variant="secondary" className="w-fit">
        Honorable Mentions
      </Badge>
    </CardHeader>
    <CardContent className="space-y-4">
      {HONORABLE_MENTIONS.map((mention) => (
        <div key={mention.handle} className="space-y-1">
          <p className="font-medium">
            {mention.name}{" "}
            <span className="text-xs text-muted-foreground">
              @{mention.handle}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">{mention.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default HonorableMentions;
