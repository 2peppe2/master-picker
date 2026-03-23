"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import Translate from "@/common/components/translate/Translate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WhyWeBuiltItCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>
        <Translate text="_about_why_title" />
      </CardTitle>
      <CardDescription>
        <Translate text="_about_why_description" />
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">
        <Translate text="_about_why_p1" />
      </p>
      <p className="text-muted-foreground">
        <Translate text="_about_why_p2" />
      </p>
    </CardContent>
  </Card>
);

export default WhyWeBuiltItCard;
