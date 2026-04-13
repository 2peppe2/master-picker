"use client";

import type { GroupMemberCardData } from "../../memberScheduleData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeftRight } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import {
  compareMemberSchedules,
  getNextMemberId,
} from "../../compareSchedules";
import CompareCourseList from "./CompareCourseList";
import CompareMemberSelectors from "./CompareMemberSelectors";
import CompareSummaryStats from "./CompareSummaryStats";

interface CompareSchedulesDialogProps {
  members: GroupMemberCardData[];
}

const CompareSchedulesDialog: FC<CompareSchedulesDialogProps> = ({
  members,
}) => {
  const [firstMemberId, setFirstMemberId] = useState(members[0]?.id ?? "");
  const [secondMemberId, setSecondMemberId] = useState(members[1]?.id ?? "");
  const canCompare = members.length >= 2;

  useEffect(() => {
    const nextFirstMemberId = members.some(
      (member) => member.id === firstMemberId,
    )
      ? firstMemberId
      : members[0]?.id ?? "";
    const nextSecondMemberId =
      members.some(
        (member) =>
          member.id === secondMemberId && member.id !== nextFirstMemberId,
      )
        ? secondMemberId
        : getNextMemberId(members, nextFirstMemberId);

    if (nextFirstMemberId !== firstMemberId) {
      setFirstMemberId(nextFirstMemberId);
    }

    if (nextSecondMemberId !== secondMemberId) {
      setSecondMemberId(nextSecondMemberId);
    }
  }, [firstMemberId, members, secondMemberId]);

  const firstMember = members.find((member) => member.id === firstMemberId);
  const secondMember = members.find((member) => member.id === secondMemberId);
  const comparison = useMemo(
    () => compareMemberSchedules(firstMember, secondMember),
    [firstMember, secondMember],
  );

  const handleFirstMemberChange = (memberId: string) => {
    setFirstMemberId(memberId);

    if (memberId === secondMemberId) {
      setSecondMemberId(getNextMemberId(members, memberId));
    }
  };

  if (!canCompare) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="w-full justify-center"
        disabled
      >
        <ArrowLeftRight className="size-4" />
        Compare schedules
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full justify-center">
          <ArrowLeftRight className="size-4" />
          Compare schedules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(780px,calc(100vh-2rem))] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-2xl bg-muted">
            <ArrowLeftRight className="size-5 text-muted-foreground" />
          </div>
          <DialogTitle>Compare schedules</DialogTitle>
          <DialogDescription>
            Pick two members to compare master-period courses taken at the same
            time.
          </DialogDescription>
        </DialogHeader>

        <CompareMemberSelectors
          members={members}
          firstMemberId={firstMemberId}
          secondMemberId={secondMemberId}
          onFirstMemberChange={handleFirstMemberChange}
          onSecondMemberChange={setSecondMemberId}
        />

        {firstMember && secondMember ? (
          <div className="space-y-5">
            <CompareSummaryStats
              sharedCount={comparison.sharedCourses.length}
              overlapPercentage={comparison.overlapPercentage}
              totalCount={comparison.unionCount}
            />

            <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Shared courses
                </h3>
                <Badge variant="outline" className="rounded-full">
                  {comparison.sharedCourses.length}
                </Badge>
              </div>
              <CompareCourseList
                courses={comparison.sharedCourses}
                emptyLabel="No shared master-period courses at the same time."
                tone="shared"
              />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Only {firstMember.name}
                  </h3>
                  <Badge variant="secondary" className="rounded-full">
                    {comparison.firstOnlyCourses.length}
                  </Badge>
                </div>
                <CompareCourseList
                  courses={comparison.firstOnlyCourses}
                  emptyLabel={`${firstMember.name} has no unique readable courses here.`}
                />
              </section>

              <section className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Only {secondMember.name}
                  </h3>
                  <Badge variant="secondary" className="rounded-full">
                    {comparison.secondOnlyCourses.length}
                  </Badge>
                </div>
                <CompareCourseList
                  courses={comparison.secondOnlyCourses}
                  emptyLabel={`${secondMember.name} has no unique readable courses here.`}
                />
              </section>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default CompareSchedulesDialog;
