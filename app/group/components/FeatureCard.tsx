import { LucideIcon } from "lucide-react";
import { FC } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-muted p-2">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default FeatureCard;
