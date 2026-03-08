"use client";

import { MainFieldRequirement } from "@/app/dashboard/page";
import { FC } from "react";

interface MainFieldRowProps {
  requirement: MainFieldRequirement;
}

const MainFieldRow: FC<MainFieldRowProps> = ({ requirement }) => {
  const listFormatter = new Intl.ListFormat("en", {
    style: "long",
    type: "disjunction",
  });

  const fieldList = listFormatter.format(requirement.fields);

  return (
    <span className="leading-snug">
      <b className="text-foreground font-semibold">{requirement.credits} HP</b>{" "}
      within the fields:{" "}
      <i className="text-muted-foreground not-italic font-medium">
        {fieldList}
      </i>
      .
    </span>
  );
};

export default MainFieldRow;
