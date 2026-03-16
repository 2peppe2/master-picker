"use server";

import AnimatedLinkedin from "@/common/components/icons/AnimatedLinkedin";
import AnimatedGithub from "@/common/components/icons/AnimatedGithub";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

interface DeveloperCardProps {
  name: string;
  description: string;
  imageSrc: string;
  githubUrl: string;
  linkedinUrl: string;
}

const DeveloperCard: FC<DeveloperCardProps> = ({
  name,
  description,
  imageSrc,
  githubUrl,
  linkedinUrl,
}) => (
  <Card className="w-full pt-0 h-full overflow-hidden flex flex-col">
    <CardContent className="p-0">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imageSrc}
          alt={`${name}'s profile`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    </CardContent>
    <CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch mt-auto">
      <Button asChild className="group">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          <AnimatedGithub className="mr-2 h-4 w-4" />
          GitHub
        </a>
      </Button>

      <Button variant="outline" asChild className="group">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex"
        >
          <AnimatedLinkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </a>
      </Button>
    </CardFooter>
  </Card>
);

export default DeveloperCard;
