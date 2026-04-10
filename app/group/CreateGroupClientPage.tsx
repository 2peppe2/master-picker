"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Blocks,
  CalendarDays,
  Loader2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState, useTransition } from "react";

const GROUP_ID_ALPHABET =
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const GROUP_ID_LENGTH = 10;

const createGroupId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(GROUP_ID_LENGTH));

  return Array.from(
    bytes,
    (byte) => GROUP_ID_ALPHABET[byte % GROUP_ID_ALPHABET.length],
  ).join("");
};

const CreateGroupClientPage: FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    setGroupId(createGroupId());
  }, []);

  const handleCreateGroup = () => {
    if (!groupId) {
      return;
    }

    startTransition(() => {
      router.push(`/group/${groupId}`);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,theme(colors.muted.DEFAULT),transparent_65%)] opacity-60" />
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 md:py-20">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-6">
            <Badge
              variant="secondary"
              className="rounded-full border-border/60 bg-background/70 px-3 py-1 shadow-sm backdrop-blur-sm"
            >
              <Users className="size-3.5" />
              Study groups
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                Create a private group for you and your friends.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                It&apos;s the perfect way to stay connect throughout your
                master.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-muted p-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      View each other&apos;s schedule
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Being able to see when your friends are available makes it
                      easier to stay connected.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-muted p-2">
                    <Blocks className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Shared courses
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Easily get an overview of shared courses within your
                      group.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Card className="overflow-hidden border-border/70 bg-card/80 py-0 shadow-xl backdrop-blur-sm">
            <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserPlus className="size-4" />
                Start a shared room in one step
              </div>
            </div>

            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-2xl tracking-tight">
                Create new group
              </CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Set up a group and jump straight into your shared room.
              </p>
            </CardHeader>

            

            <CardFooter className="flex flex-col gap-3 px-6 py-6">
              <Button
                size="lg"
                className="w-full"
                onClick={handleCreateGroup}
                disabled={!groupId || isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                Create group room
              </Button>
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Invite your friends once the room is ready.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateGroupClientPage;
