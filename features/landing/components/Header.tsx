"use client";

import Translate from "@/common/components/translate/Translate";
import { Playfair_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import "@/lib/i18n";

// Variable face, so the wordmark picks up optical sizing across its range.
const playfair = Playfair_Display({ subsets: ["latin"] });

/*
 * Note the md: step on the title: a landscape phone is 667-932px wide, so it
 * matches both sm: and md: and would otherwise render the 60px headline
 * against ~390px of height. The landscape-phone: overrides come last so they
 * win over both.
 */
const Header: FC = () => (
  <header
    className={cn(
      "flex w-full flex-col items-center px-2 py-5 sm:px-4 sm:py-6",
      "landscape-phone:w-1/2 landscape-phone:max-w-sm landscape-phone:items-start",
      "landscape-phone:px-0 landscape-phone:py-0 landscape-phone:text-left",
    )}
  >
    <div
      className={cn(
        "mb-4 flex items-center justify-center gap-3 sm:gap-4",
        "landscape-phone:mb-2 landscape-phone:gap-2",
        "animate-landing-rise",
      )}
    >
      <Image
        src="/logo/mp_logo_icon.svg"
        alt="LiU Master Logo"
        width={64}
        height={64}
        // The LCP element on this page.
        priority
        className="size-14 sm:size-16 landscape-phone:size-10"
      />
      <h1
        className={cn(
          "text-4xl font-bold tracking-[-0.02em] text-balance",
          "sm:text-5xl md:text-6xl",
          "landscape-phone:text-3xl landscape-phone:tracking-[-0.01em]",
          playfair.className,
        )}
      >
        Master Picker
      </h1>
    </div>

    <p
      className={cn(
        "mb-3 max-w-xl text-center text-base leading-relaxed text-pretty",
        "text-muted-foreground sm:mb-4 sm:text-lg",
        "landscape-phone:mb-1 landscape-phone:max-w-none",
        "landscape-phone:text-left landscape-phone:text-sm",
        "animate-landing-rise [animation-delay:60ms]",
      )}
    >
      <Translate text="_landing_header_subtitle" />
    </p>

    <Button
      variant="link"
      asChild
      className={cn(
        "mb-6 h-auto py-1 hover:text-brand sm:mb-8",
        "landscape-phone:mb-0 landscape-phone:px-0",
        "animate-landing-rise [animation-delay:120ms]",
      )}
    >
      <Link href="/about">
        <Translate text="_learn_more_about_the_project" />
      </Link>
    </Button>
  </header>
);

export default Header;
