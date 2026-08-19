"use client";

import LanguageSwitcherInner, {
  LanguageSwitcherProps,
} from "./components/LanguageSwitcherInner";
import { Button } from "@/components/ui/button";
import { FC, Suspense } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/lib/i18n";

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ className }) => (
  <Suspense
    fallback={
      <Button
        variant="outline"
        size="sm"
        className={cn("h-9 gap-2 px-4 text-sm font-medium", className)}
      >
        <Languages className="h-4 w-4" />
        SV
      </Button>
    }
  >
    <LanguageSwitcherInner className={className} />
  </Suspense>
);

export default LanguageSwitcher;
