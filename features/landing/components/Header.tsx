"use client";

import Translate from "@/common/components/translate/Translate";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import "@/lib/i18n";

const playfair = Playfair_Display({ weight: "600", subsets: ["latin"] });

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
      "landscape-phone:py-0",
    )}
  >
    <div
      className={cn(
        "mb-4 flex items-center justify-center gap-3 sm:gap-4",
        "landscape-phone:mb-2 landscape-phone:gap-2",
      )}
    >
      <Image
        src="/logo/mp_logo_icon.svg"
        alt="LiU Master Logo"
        width={64}
        height={64}
        className="size-14 sm:size-16 landscape-phone:size-10"
      />
      <h1
        className={cn(
          "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
          "landscape-phone:text-3xl",
          playfair.className,
        )}
      >
        Master Picker
      </h1>
    </div>

    <p
      className={cn(
        "mb-6 max-w-xl text-center text-base text-muted-foreground",
        "sm:mb-8 sm:text-lg",
        "landscape-phone:mb-0 landscape-phone:max-w-md landscape-phone:text-sm",
      )}
    >
      <Translate text="_landing_header_subtitle" />
    </p>
  </header>
);

export default Header;
