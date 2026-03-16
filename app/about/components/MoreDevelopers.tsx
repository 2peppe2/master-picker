"use server";

import AnimatedGithub from "@/common/components/icons/AnimatedGithub";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MoreDevelopers = () => {
  return (
    <Card className="max-w-md border-dashed bg-gradient-to-br from-card via-card to-muted/40">
      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit">
          Contribute
        </Badge>
        <CardTitle>And maybe you?</CardTitle>
        <CardDescription>
          We are a small team and always open to thoughtful contributions.
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
            Repository
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="mailto:hej@masterpicker.se">Contact</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoreDevelopers;
