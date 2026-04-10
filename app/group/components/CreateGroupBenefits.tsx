import FeatureCard from "./FeatureCard";
import GroupPageHero from "./GroupPageHero";
import { Blocks, CalendarDays, Users } from "lucide-react";
import { FC } from "react";

const CreateGroupBenefits: FC = () => (
  <section className="space-y-6">
    <GroupPageHero
      badgeLabel="Study groups"
      badgeIcon={Users}
      title="Create a private group for you and your friends."
      description="It&apos;s the perfect way to stay connect throughout your master."
    />

    <div className="grid gap-4 sm:grid-cols-2">
      <FeatureCard
        icon={CalendarDays}
        title="View each other&apos;s schedule"
        description="Being able to see when your friends are available makes it easier to stay connected."
      />
      <FeatureCard
        icon={Blocks}
        title="Shared courses"
        description="Easily get an overview of shared courses within your group."
      />
    </div>
  </section>
);

export default CreateGroupBenefits;
