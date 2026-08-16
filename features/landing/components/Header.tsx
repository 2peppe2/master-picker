"use client";

import Translate from "@/common/components/translate/Translate";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { FC } from "react";
import "@/lib/i18n";

const playfair = Playfair_Display({ weight: "600", subsets: ["latin"] });

const Header: FC = () => (
  <header className="flex w-full flex-col items-center px-2 py-5 sm:px-4 sm:py-6">
    <div className="mb-4 flex items-center justify-center gap-3 sm:gap-4">
      <Image
        src="/logo/mp_logo_icon.svg"
        alt="LiU Master Logo"
        width={64}
        height={64}
        className="size-14 sm:size-16"
      />
      <h1
        className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ${playfair.className}`}
      >
        Master Picker
      </h1>
    </div>

    <p className="mb-6 max-w-xl text-center text-base text-muted-foreground sm:mb-8 sm:text-lg">
      <Translate text="_landing_header_subtitle" />
    </p>
  </header>
);

export default Header;
