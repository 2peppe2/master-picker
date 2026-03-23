"use client";

import Translate from "@/common/components/translate/Translate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SupportCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>
        <Translate text="_about_support_title" />
      </CardTitle>
      <CardDescription>
        <Translate text="_about_support_description" />
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 text-sm">
      <div className="space-y-1">
        <p className="font-medium">
          <Translate text="_about_support_help_title" />
        </p>
        <p className="text-muted-foreground">
          <Translate text="_about_support_help_text" />
        </p>
      </div>
      <div className="space-y-1">
        <p className="font-medium">
          <Translate text="_about_support_bug_title" />
        </p>
        <p className="text-muted-foreground">
          <Translate
            text="_about_support_bug_text"
            args={{ email: "hej@masterpicker.se" }}
          />
        </p>
      </div>
    </CardContent>
  </Card>
);

export default SupportCard;
