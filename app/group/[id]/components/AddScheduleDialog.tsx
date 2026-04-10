"use client";

import { addGroupMember, AddGroupMemberResult } from "../actions";
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
import { useRouter } from "next/navigation";
import { FC, FormEvent, useState, useTransition } from "react";

interface AddScheduleDialogProps {
  groupId: string;
}

const AddScheduleDialog: FC<AddScheduleDialogProps> = ({ groupId }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [scheduleUrl, setScheduleUrl] = useState("");
  const [submitResult, setSubmitResult] = useState<AddGroupMemberResult | null>(
    null,
  );

  const resetForm = () => {
    setName("");
    setScheduleUrl("");
    setSubmitResult(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await addGroupMember({
        groupId,
        name,
        scheduleUrl,
      });

      setSubmitResult(result);

      if (!result.success) {
        return;
      }

      resetForm();
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetForm();
        }
      }}
    >
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
              disabled={isPending}
            />
            {submitResult?.fieldErrors?.name ? (
              <p className="text-sm text-destructive">
                {submitResult.fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="group-schedule-url">Schedule URL</Label>
            <Input
              id="group-schedule-url"
              value={scheduleUrl}
              onChange={(event) => setScheduleUrl(event.target.value)}
              placeholder="https://..."
              type="url"
              disabled={isPending}
            />
            <p className="text-sm leading-6 text-muted-foreground">
              Copy the URL from your schedule page and paste it here.
            </p>
            {submitResult?.fieldErrors?.scheduleUrl ? (
              <p className="text-sm text-destructive">
                {submitResult.fieldErrors.scheduleUrl}
              </p>
            ) : null}
          </div>

          {submitResult?.formError ? (
            <p className="text-sm text-destructive">{submitResult.formError}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !scheduleUrl.trim() || isPending}
            >
              Add schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleDialog;
