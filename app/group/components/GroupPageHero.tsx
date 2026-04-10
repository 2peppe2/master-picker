import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface GroupPageHeroProps {
  badgeLabel: string;
  badgeIcon: LucideIcon;
  title: string;
  description: string;
}

const GroupPageHero: FC<GroupPageHeroProps> = ({
  badgeLabel,
  badgeIcon: BadgeIcon,
  title,
  description,
}) => (
  <section className="space-y-4">
    <Badge
      variant="secondary"
      className="rounded-full border-border/60 bg-background/70 px-3 py-1 shadow-sm backdrop-blur-sm"
    >
      <BadgeIcon className="size-3.5" />
      {badgeLabel}
    </Badge>

    <div className="space-y-3">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
        {description}
      </p>
    </div>
  </section>
);

export default GroupPageHero;
