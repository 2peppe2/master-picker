"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

const WhyWeBuiltItCard = () => {
  const t = useCommonTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("_about_why_title")}</CardTitle>
        <CardDescription>{t("_about_why_description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{t("_about_why_p1")}</p>
        <p className="text-muted-foreground">{t("_about_why_p2")}</p>
      </CardContent>
    </Card>
  );
};

export default WhyWeBuiltItCard;
