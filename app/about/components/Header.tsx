"use client";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import Translate from "@/common/components/translate/Translate";
import BackButton from "@/common/components/BackButton";
import { FC } from "react";
import "@/lib/i18n";

const Header: FC = () => {
  return (
    <header className="flex flex-col gap-6 relative">
      <div className="absolute top-0 right-0">
        <LanguageSwitcher />
      </div>
      <div className="flex items-center gap-4">
        <BackButton
          title="Master Picker"
          subtitle="about"
          returnText="_dashboard_return_to_landing"
        />
      </div>
      <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
        <Translate text="_about_description" />
      </p>
    </header>
  );
};

export default Header;
