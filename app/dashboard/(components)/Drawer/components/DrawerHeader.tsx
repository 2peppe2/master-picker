"use client";

import LanguageSwitcher from "@/common/components/translate/LanguageSwitcher";
import BackButton from "@/common/components/BackButton";
import ShareButton from "./ShareButton";
import { FC } from "react";

const DrawerHeader: FC = () => (
  <div className="pl-5 pr-4 pt-4 flex items-center gap-3 shrink-0 w-full justify-between">
    <BackButton
      title="MasterPicker"
      subtitle="_dashboard_header_subtitle"
      returnText="_dashboard_return_to_landing"
    />
    <div className="flex items-center gap-2">
      <LanguageSwitcher />
      <ShareButton />
    </div>
  </div>
);

export default DrawerHeader;
