"use client";

import type { GroupMemberCardData } from "../../memberScheduleData";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC } from "react";

interface CompareMemberSelectorsProps {
  members: GroupMemberCardData[];
  firstMemberId: string;
  secondMemberId: string;
  onFirstMemberChange: (memberId: string) => void;
  onSecondMemberChange: (memberId: string) => void;
}

const CompareMemberSelectors: FC<CompareMemberSelectorsProps> = ({
  members,
  firstMemberId,
  secondMemberId,
  onFirstMemberChange,
  onSecondMemberChange,
}) => (
  <div className="grid gap-3 sm:grid-cols-2">
    <div className="space-y-2">
      <Label>First member</Label>
      <Select value={firstMemberId} onValueChange={onFirstMemberChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose member" />
        </SelectTrigger>
        <SelectContent>
          {members.map((member) => (
            <SelectItem
              key={member.id}
              value={member.id}
              disabled={member.id === secondMemberId}
            >
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Second member</Label>
      <Select value={secondMemberId} onValueChange={onSecondMemberChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose member" />
        </SelectTrigger>
        <SelectContent>
          {members.map((member) => (
            <SelectItem
              key={member.id}
              value={member.id}
              disabled={member.id === firstMemberId}
            >
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default CompareMemberSelectors;
