"use client";

import AnimatedGithub from "@/common/components/icons/AnimatedGithub";
import Translate from "@/common/components/translate/Translate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MoreDevelopers = () => (
  <Card className="max-w-md border-dashed bg-gradient-to-br from-card via-card to-muted/40">
    <CardHeader className="gap-2">
      <Badge variant="secondary" className="w-fit">
        <Translate text="_about_contribute_title" />
      </Badge>
      <CardTitle>
        <Translate text="_about_contribute_subtitle" />
      </CardTitle>
      <CardDescription>
        <Translate text="_about_contribute_desc" />
      </CardDescription>
    </CardHeader>

    <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch mt-auto">
      <Button asChild className="group">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/2peppe2/master-picker"
        >
          <AnimatedGithub className="mr-2 h-4 w-4" />
          <Translate text="_about_repository" />
        </a>
      </Button>
      <Button variant="outline" asChild>
        <a href="mailto:hej@masterpicker.se">
          <Translate text="_about_contact" />
        </a>
      </Button>
    </CardFooter>
  </Card>
);

export default MoreDevelopers;
