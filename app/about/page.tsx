import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Playfair_Display } from "next/font/google";
import { Button } from "@/components/ui/button";

const playfair = Playfair_Display({ weight: "600", subsets: ["latin"] });

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-24">
        <Header />
        <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Why We Built It</CardTitle>
              <CardDescription>The story behind the project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We built Master Picker after seeing how hard it was to answer
                simple questions like “Which courses are required?” or “What
                fits in my schedule?” The information existed, but it was spread
                across many places.
              </p>
              <p className="text-muted-foreground">
                We believe that we have created a tool that can help students make informed decisions and plan their studies without getting lost in spreadsheets. We hope it can save time and reduce stress for many students in the future.
              </p>
            </CardContent>
          </Card>
          <SupportCard />
        </section>
        <h2 className="mt-12 mb-6 text-2xl font-semibold tracking-tight">
          Developers
        </h2>
        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PetrusDeveloperCard />
            <MikaelDeveloperCard />
          <div className="flex flex-col gap-6">
            <HonorableMentions />
            <MoreDevelopers />
          </div>

        </section>
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MasterPicker. All rights reserved.
        </footer>
        

        
      </main>
    </div>
  );
};

export default AboutPage;

const Header = () => (
  <header className="flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <Link
        href="/"
        aria-label="Go to home"
        className="flex h-20 w-20 items-center justify-center rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Image
          src="/logo/mp_logo_icon.svg"
          alt="Master Picker logo"
          width={50}
          height={50}
        />
      </Link>
      <div className="flex flex-col gap-2">
        <Badge variant="secondary">About</Badge>
        <h1
          className={`text-3xl tracking-tight sm:text-4xl md:text-5xl ${playfair.className}`}
        >
          Master Picker
        </h1>
      </div>
    </div>
    <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
      Master Picker helps LiU students compare master programs, understand
      requirements, and plan courses without getting lost in spreadsheets.
    </p>
  </header>
);

const SupportCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Support us</CardTitle>
      <CardDescription>Unfortunately we lose money on this site :(</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 text-sm">
      
      <div className="space-y-1">
        <p className="font-medium">Help out</p>
        <p className="text-muted-foreground">
          By sending a swish payment to{" "}
          <a href="sms:0705472993" className="font-medium text-muted-foreground hover:underline">
            0705472993
          </a>
          {" "}you can help cover the hosting costs and keep the project running.
        </p>
      </div>
      <div className="space-y-1">
        <p className="font-medium">Found error?</p>
        <p className="text-muted-foreground">
            Make a swish payment (helps us a ton) and send us an email at{" "}
            <a href="mailto:hej@masterpicker.se" className="font-medium text-muted-foreground hover:underline">hej@masterpicker.se</a>{" "}
                with the details so we can fix it!

        </p>
      </div>
    </CardContent>
  </Card>
);

const PetrusDeveloperCard = () => {
  return (
    <Card className='max-w-md pt-0'>
      <CardContent className='px-0'>
        <Image
          src='/profile/petrus.png'
          alt='Banner'
          className='aspect-video h-70 rounded-t-xl object-cover'
          width={500}
          height={500}
        />
      </CardContent>
      <CardHeader>
        <CardTitle>Petrus Jarl</CardTitle>
        <CardDescription>People First. God Always. Code cool stuff!.</CardDescription>
      </CardHeader>
      <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch mt-auto'>
        <Button asChild>
            <a href="https://github.com/2peppe2" target="_blank" rel="noopener noreferrer">
            <Github className='mr-2 h-4 w-4' />
            GitHub
            </a>
        </Button>
        <Button variant={'outline'}>
            <a href="https://www.linkedin.com/in/petrus-jarl-3697b5261/" target="_blank" rel="noopener noreferrer" className="flex">
            <Linkedin className='mr-2 h-4 w-4' />
             LinkedIn
            </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

const MikaelDeveloperCard = () => {
  return (
    <Card className='max-w-md pt-0'>
      <CardContent className='px-0'>
        <Image
          src='/profile/mikael.png'
          alt='Banner'
          className='aspect-video h-70 rounded-t-xl object-cover'
          width={500}
          height={500}
        />
      </CardContent>
      <CardHeader>
        <CardTitle>Mikael Karlsson</CardTitle>
        <CardDescription>Hope you are doing good. Remember that you can learn anything :D</CardDescription>
      </CardHeader>
      <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch mt-auto'>
        <Button asChild>
            <a href="https://github.com/BakuPlayz" target="_blank" rel="noopener noreferrer">
            <Github className='mr-2 h-4 w-4' />
            GitHub
            </a>
        </Button>
        <Button variant={'outline'}>
            <a href="https://www.linkedin.com/in/mikael-karlsson-8212a91b1/" target="_blank" rel="noopener noreferrer" className="flex">
            <Linkedin className='mr-2 h-4 w-4' />
             LinkedIn
            </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
const honorableMentions = [
  {
    name: "Lukas",
    handle: "lukasabbe",
    description:
      "For help with LiU statistics and general support at the end of the project.",
  },
    {
    name: "Tristan",
    handle: "TristanTrille",
    description:
      "For the help with promoting the project and providing feedback.",
  },
];

const HonorableMentions = () => {
  return (
    <Card className="max-w-md border-dashed bg-gradient-to-br from-card via-card to-muted/40">
      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit">
          Honorable Mentions
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {honorableMentions.map((mention) => (
          <div key={mention.handle} className="space-y-1">
            <p className="font-medium">
              {mention.name}{" "}
              <span className="text-xs text-muted-foreground">
                @{mention.handle}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {mention.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

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
        <Button asChild>
          <a
            href="https://github.com/2peppe2/master-picker"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            Git Repo
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="mailto:hej@masterpicker.se">Contact</a>
        </Button>
      </CardFooter>
    </Card>
  );
};
