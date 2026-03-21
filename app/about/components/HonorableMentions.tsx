"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

interface HonorableMention {
  name: string;
  handle: string;
  descriptionKey: string;
}

const HonorableMentions = () => {
  const t = useCommonTranslate();

  const HONORABLE_MENTIONS: HonorableMention[] = [
    {
      name: "Lukas",
      handle: "lukasabbe",
      descriptionKey: "_about_honorable_lukas",
    },
    {
      name: "Tristan",
      handle: "TristanTrille",
      descriptionKey: "_about_honorable_tristan",
    },
  ];

  return (
    <Card className="max-w-md border-dashed bg-gradient-to-br from-card via-card to-muted/40 gap-0">
      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit">
          {t("_about_honorable_mentions")}
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
            <p className="text-sm text-muted-foreground">
              {t(mention.descriptionKey)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HonorableMentions;
