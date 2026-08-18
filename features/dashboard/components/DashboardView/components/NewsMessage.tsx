"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { Smartphone } from "lucide-react";
import { FC } from "react";

const NewsMessage: FC = () => {
  const translate = useCommonTranslate();

  return (
    <>
      <Smartphone
        aria-hidden="true"
        className="size-4 shrink-0 text-[rgb(0,100,89)] dark:text-[rgb(0,200,179)]"
      />
      <p
        aria-label={translate("_mobile_support_announcement_title")}
        data-mobile-support-announcement
        className="text-center text-xs font-semibold leading-tight text-foreground"
      >
        {translate("_mobile_support_announcement_title")} {" "}
        <span className="font-normal text-muted-foreground">
          {translate("_mobile_support_announcement_body")}
        </span>
      </p>
    </>
  );
};

export default NewsMessage;
