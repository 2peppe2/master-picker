"use client";

import { Badge } from "@/components/ui/badge";
import { evaluateMemberMasterProgress } from "../memberMasterProgress";
import { GroupMemberCardData } from "../memberScheduleData";
import {
  Blocks,
  CalendarRange,
  ExternalLink,
  GraduationCap,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { FC, useMemo } from "react";

interface MemberScheduleCardProps {
  member: GroupMemberCardData;
}

const MemberScheduleCard: FC<MemberScheduleCardProps> = ({ member }) => {
  const topMasters = useMemo(
    () =>
      member.mastersWithRequirements
        .map((master) => {
          const rawRequirements = master.requirements.flatMap(
            (requirementGroup) => requirementGroup.requirements,
          );
          const evaluation = evaluateMemberMasterProgress(
            master.master,
            rawRequirements,
            member.selectedCourses,
            member.selectedMasterCourses,
          );

          return {
            master: master.master,
            name: master.name ?? master.master,
            progress: evaluation.progress,
          };
        })
        .sort((a, b) => {
          if (a.progress === 100 && b.progress !== 100) return -1;
          if (b.progress === 100 && a.progress !== 100) return 1;
          if (b.progress !== a.progress) return b.progress - a.progress;
          return a.master.localeCompare(b.master);
        })
        .slice(0, 3),
    [member.mastersWithRequirements, member.selectedCourses, member.selectedMasterCourses],
  );

  return (
    <div className="rounded-3xl border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(248,248,248,0.65))] p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 dark:bg-[linear-gradient(180deg,rgba(38,38,38,0.95),rgba(28,28,28,0.85))]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-muted p-3 shadow-sm">
            <Image src={`https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${member.name}`} alt={`${member.name}'s avatar`} width={40} height={40} className="rounded-full" unoptimized />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              {member.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {member.courseCount > 0
                ? `${member.courseCount} scheduled course${
                    member.courseCount === 1 ? "" : "s"
                  }`
                : "No readable schedule found"}
            </p>
          </div>
        </div>

        <a
          href={member.scheduleUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Open
          <ExternalLink className="size-4" />
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {member.program ? (
          <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
            <GraduationCap className="size-3.5" />
            {member.program}
          </Badge>
        ) : null}
        {member.year !== null ? (
          <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1">
            <CalendarRange className="size-3.5" />
            Start {member.year}
          </Badge>
        ) : null}
        <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
          <Blocks className="size-3.5" />
          {member.courseCount} courses
        </Badge>
      </div>

      <div className="mt-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Top profile matches
          </p>
          {topMasters.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {topMasters.map((master, index) => (
                <div
                  key={master.master}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-2 text-sm"
                >
                  <Trophy className="size-3.5 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {index + 1}. {master.name}
                  </span>
                  <span className="text-muted-foreground">
                    {master.progress}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">
                Not enough schedule data to rank master profiles yet.
              </p>
            </div>
          )}
        </div>

        {member.courses.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {member.courses.map((course) => (
              <div
                key={course.code}
                className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2"
                title={course.name}
              >
                <p className="text-xs font-semibold tracking-wide text-foreground">
                  {course.code}
                </p>
                <p className="mt-1 max-w-44 truncate text-xs text-muted-foreground">
                  {course.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">
              This schedule link does not contain readable course data yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberScheduleCard;
