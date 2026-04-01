"use client";

import Translate from "@/common/components/translate/Translate";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { FC } from "react";
import { CourseCollision } from "@/app/dashboard/(store)/schedule/hooks/useCourseCollisions";

interface CollisionBannerProps {
  collisions: CourseCollision[];
}

const CollisionBanner: FC<CollisionBannerProps> = ({ collisions }) => {
  if (collisions.length === 0) return null;

  const uniquePairs = Array.from(
    new Set(
      collisions.map((c) =>
        [c.course1.code, c.course2.code].sort().join(" // "),
      ),
    ),
  );

  return (
    <div className="rounded-none border-t border-destructive/20 bg-destructive/5 px-10 py-8 flex flex-col items-center gap-4 text-destructive animate-in fade-in slide-in-from-bottom-0 duration-500">
      <div className="flex items-center gap-3 w-full">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div className="flex flex-col gap-0.5">
          <h4 className="font-semibold text-sm leading-tight tracking-tight">
            <Translate text="_guide_collision_title" />
          </h4>
          <p className="text-sm opacity-90 leading-relaxed max-w-[800px]">
            <Translate text="_guide_collision_desc" />
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 w-full justify-start pl-8">
        {uniquePairs.map((pair, idx) => (
          <Badge
            key={idx}
            variant="destructive"
            className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/30 transition-all text-[10px] font-mono py-1 px-3 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            {pair}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CollisionBanner;
