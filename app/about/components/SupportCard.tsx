"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SupportCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Support us</CardTitle>
      <CardDescription>
        Unfortunately we lose money on this site :(
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 text-sm">
      <div className="space-y-1">
        <p className="font-medium">Help out</p>
        <p className="text-muted-foreground">
          We would love your support to keep the project running and free for
          everyone. You can help by sharing the project with friends, providing
          feedback, or contributing code if you are a developer.
        </p>
      </div>
      <div className="space-y-1">
        <p className="font-medium">Found a bug?</p>
        <p className="text-muted-foreground">
          Send us an email at{" "}
          <a
            href="mailto:hej@masterpicker.se"
            className="font-medium text-muted-foreground hover:underline"
          >
            hej@masterpicker.se
          </a>{" "}
          with the details so we can fix it!
        </p>
      </div>
    </CardContent>
  </Card>
);

export default SupportCard;
