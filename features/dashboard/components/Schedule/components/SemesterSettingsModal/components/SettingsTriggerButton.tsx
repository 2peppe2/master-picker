"use client";

import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { FC } from "react";

type SettingsTriggerButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  label: string;
};

const SettingsTriggerButton: FC<SettingsTriggerButtonProps> = ({
  label,
  ...props
}) => (
  <Button
    {...props}
    variant="ghost"
    size="icon"
    className="ml-auto h-8 w-8 hover:bg-accent"
    aria-label={label}
    onClick={(event) => {
      event.stopPropagation();
      props.onClick?.(event);
    }}
  >
    <Ellipsis className="size-4" />
  </Button>
);

export default SettingsTriggerButton;
