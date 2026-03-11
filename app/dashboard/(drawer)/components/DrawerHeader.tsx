"use client";

import { ChevronLeft } from "lucide-react";
import ShareButton from "./ShareButton";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const DrawerHeader: FC = () => (
  <div className="pl-1 pt-4 flex items-center gap-3 shrink-0 w-full justify-between">
    <Link href="/" className="group flex items-center gap-3 transition-colors">
      <ChevronLeft className="absolute size-4 text-[#00C8B3] transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1" />
      <Image
        src="/logo/mp_logo_icon.svg"
        alt="Logo"
        width={22}
        height={22}
        className="shrink-0 transition-all duration-300 group-hover:opacity-0 group-hover:scale-75"
      />

      <div className="flex flex-col min-w-0">
        <span className="text-xs font-bold leading-none transition-colors">
          Dashboard
        </span>

        <div className="mt-1 text-[10px] tracking-wider font-medium">
          <span className="block group-hover:hidden text-muted-foreground transition-all">
            Course Browser
          </span>
          <span className="hidden group-hover:block text-[#00C8B3] animate-in fade-in slide-in-from-bottom-1 duration-200">
            Return to Landing
          </span>
        </div>
      </div>
    </Link>
    <ShareButton />
  </div>
);

export default DrawerHeader;
