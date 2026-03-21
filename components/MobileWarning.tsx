"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import { Monitor } from "lucide-react";

export default function MobileWarning() {
  const t = useCommonTranslate();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6 text-center lg:hidden">
      <div className="mb-6 rounded-2xl bg-muted p-4">
        <Monitor className="h-12 w-12 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("desktop_only")}
          </p>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("mobile_warning_text")}
        </h1>

        <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
          {t("mobile_warning_subtext")}
        </p>
      </div>
    </div>
  );
}
