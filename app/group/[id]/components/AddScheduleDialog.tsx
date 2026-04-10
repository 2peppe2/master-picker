"use client";

import { Button } from "@/components/ui/button";
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
import { UserPlus } from "lucide-react";
import { FC, FormEvent, useState } from "react";

const AddScheduleDialog: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [scheduleUrl, setScheduleUrl] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <form className="space-y-5" onSubmit={handleSubmit}>
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
              Copy the URL from your schedule page and paste it here.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || !scheduleUrl.trim()}>
              Add schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleDialog;
