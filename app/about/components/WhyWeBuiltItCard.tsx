"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WhyWeBuiltItCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Why We Built It</CardTitle>
      <CardDescription>The story behind the project.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-muted-foreground">
        We built Master Picker after seeing how hard it was to answer simple
        questions like “Which courses are required?” or “What fits in my
        schedule?” The information existed, but it was spread across many
        places.
      </p>
      <p className="text-muted-foreground">
        We believe that we have created a tool that can help students make
        informed decisions and plan their studies without getting lost in
        spreadsheets. We hope it can save time and reduce stress for many
        students in the future.
      </p>
    </CardContent>
  </Card>
);

export default WhyWeBuiltItCard;
