"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";

const SupportCard = () => {
  const t = useCommonTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("_about_support_title")}</CardTitle>
        <CardDescription>{t("_about_support_description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="space-y-1">
          <p className="font-medium">{t("_about_support_help_title")}</p>
          <p className="text-muted-foreground">{t("_about_support_help_text")}</p>
        </div>
        <div className="space-y-1">
          <p className="font-medium">{t("_about_support_bug_title")}</p>
          <p className="text-muted-foreground">
            {t("_about_support_bug_text", { email: "hej@masterpicker.se" })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCard;
