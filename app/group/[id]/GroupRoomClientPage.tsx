"use client";

import { useCopyToClipboard } from "@/app/dashboard/(components)/Drawer/components/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, DoorOpen, Loader2, Share2, UserPlus, Users } from "lucide-react";
import { FC, FormEvent, useEffect, useState } from "react";

interface GroupRoomClientPageProps {
  groupId: string;
}

const GroupRoomClientPage: FC<GroupRoomClientPageProps> = ({ groupId }) => {
  const { copied, copy } = useCopyToClipboard();
  const [isSharing, setIsSharing] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [name, setName] = useState("");
  const [scheduleUrl, setScheduleUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [groupId]);

  const handleAddSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAddScheduleOpen(false);
  };

  const handleShare = async () => {
    if (!shareUrl || isSharing) {
      return;
    }

    setIsSharing(true);

    const shareData = {
      title: "Master Picker",
      text: "Join my group on Master Picker.",
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        setIsSharing(false);
        return;
      } catch (error) {
        console.log("Native share failed, falling back to copy:", error);
      }
    }

    copy(shareUrl);
    setIsSharing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,theme(colors.muted.DEFAULT),transparent_65%)] opacity-60" />
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-12 md:py-20">
        <div className="w-full space-y-8">
          <section className="space-y-4">
            <Badge
              variant="secondary"
              className="rounded-full border-border/60 bg-background/70 px-3 py-1 shadow-sm backdrop-blur-sm"
            >
              <Users className="size-3.5" />
              Group room
            </Badge>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                Your study group room is ready.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Bring your group together in one shared space.
              </p>
            </div>
          </section>

          <Card className="overflow-hidden border-border/70 bg-card/80 py-0 shadow-xl backdrop-blur-sm">
            <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DoorOpen className="size-4" />
                Group actions
              </div>
            </div>
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-center text-2xl tracking-tight">
                Manage your room
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-8 pt-2">
              <div className="mx-auto grid max-w-xl gap-3 sm:grid-cols-2">
                <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full justify-center">
                      <UserPlus className="size-4" />
                      Add my schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add your schedule</DialogTitle>
                      <DialogDescription>
                        Fill in your details to add your schedule to the group.
                      </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-5" onSubmit={handleAddSchedule}>
                      <div className="space-y-2">
                        <Label htmlFor="group-member-name">Name</Label>
                        <Input
                          id="group-member-name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Your name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="group-schedule-url">Schedule URL</Label>
                        <Input
                          id="group-schedule-url"
                          value={scheduleUrl}
                          onChange={(event) => setScheduleUrl(event.target.value)}
                          placeholder="https://..."
                          type="url"
                        />
                        <p className="text-sm leading-6 text-muted-foreground">
                          Copy the URL from your schedule page and paste it
                          here.
                        </p>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddScheduleOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!name.trim() || !scheduleUrl.trim()}
                        >
                          Add schedule
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full justify-center",
                    copied &&
                      "border-emerald-600 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 hover:text-emerald-700 dark:border-emerald-400 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/20 dark:hover:text-emerald-300",
                  )}
                  onClick={handleShare}
                  disabled={!shareUrl || isSharing}
                >
                  {isSharing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Share2 className="size-4" />
                  )}
                  {isSharing ? "Sharing..." : copied ? "Copied" : "Invite friends"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GroupRoomClientPage;
