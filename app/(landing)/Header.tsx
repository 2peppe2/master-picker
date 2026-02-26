'use client';

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { useTranslation } from "react-i18next";
import '@/lib/i18n';


const playfair = Playfair_Display({ weight: "600", subsets: ["latin"] });

const Header = () => {
  const { t } = useTranslation("common");

  return (
    <header className="w-full py-6 px-4 flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Image
          src="/logo/mp_logo_icon.svg"
          alt="LiU Master Logo"
          width={70}
          height={70}
        />
        <h1 className={`text-2xl md:text-7xl font-bold ${playfair.className}`}>
          {t("headerTitle")}
        </h1>
      </div>

      <p className="mb-8 max-w-xl text-center text-lg text-muted-foreground">
        {t("headerSubtitle")}
      </p>
    </header>
  );
};

export default Header;
