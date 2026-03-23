"use client";

import { useCommonTranslate } from "@/common/hooks/useCommonTranslate";
import DeveloperCard from "./DeveloperCard";

const DevelopersSection = () => {
  const translate = useCommonTranslate();

  return (
    <div className="flex flex-col lg:flex-row lg:col-span-2 w-full gap-6 h-full">
      <DeveloperCard
        name="Petrus Jarl"
        description={translate("_about_devs_petrus_desc")}
        imageSrc="/profile/petrus.png"
        githubUrl="https://github.com/2peppe2"
        linkedinUrl="https://www.linkedin.com/in/petrus-jarl-3697b5261/"
      />
      <DeveloperCard
        name="Mikael Karlsson"
        description={translate("_about_devs_mikael_desc")}
        imageSrc="/profile/mikael.png"
        githubUrl="https://github.com/BakuPlayz"
        linkedinUrl="https://www.linkedin.com/in/mikael-karlsson-8212a91b1/"
      />
    </div>
  );
};

export default DevelopersSection;
