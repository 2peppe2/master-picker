"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { CourseCollision } from "@/app/dashboard/(store)/schedule/hooks/useCourseCollisions";
import Translate from "@/common/components/translate/Translate";
import CourseTranslate from "@/common/components/translate/CourseTranslate";
import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GuideCourseWithOccasion {
  code: string;
  name: string;
  selectedOccasionIndex?: number;
  CourseOccasion?: any[];
}

interface GuideCollisionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collisions: CourseCollision[];
  onContinueAnyway: () => void;
  selectedOccasions: Record<string, number>;
  onOccasionChange: (courseCode: string, index: number) => void;
}

const GuideCollisionDialog: FC<GuideCollisionDialogProps> = ({
  isOpen,
  onOpenChange,
  collisions,
  onContinueAnyway,
  selectedOccasions,
  onOccasionChange,
}) => {
  const translate = useCommonTranslate();
  const hasCollisions = collisions.length > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <AlertDialogHeader className="px-8 pt-8 pb-4 shrink-0 border-b bg-muted/30">
          <div className={cn(
            "flex items-center gap-3 font-bold mb-1 tracking-tight text-xl transition-colors",
            hasCollisions ? "text-destructive" : "text-emerald-600"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-2xl flex items-center justify-center transition-all shadow-lg",
              hasCollisions ? "bg-destructive/15 text-destructive animate-pulse" : "bg-emerald-100 text-emerald-600"
            )}>
              <AlertCircle className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-2xl">
              <Translate text={hasCollisions ? "_guide_collision_title" : "_guide_collision_resolved"} />
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-muted-foreground/80 font-medium">
            <Translate text={hasCollisions ? "_guide_collision_desc" : "_guide_collision_resolved_desc"} />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-card/10">
          {hasCollisions ? (
            <div className="flex flex-col rounded-2xl border bg-muted/5 divide-y divide-muted-foreground/10 overflow-hidden shadow-sm">
              {collisions.map((collision, idx) => (
                <div
                  key={`collision-${idx}`}
                  className="flex flex-col gap-3 p-4 transition-all hover:bg-muted/10 group"
                >
                  <div className="flex items-center justify-between text-muted-foreground font-semibold text-[10px] pb-1">
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span className="uppercase tracking-wider">
                        <Translate text="_year" />{" "}
                        {collision.course1.CourseOccasion?.[(collision.course1 as GuideCourseWithOccasion).selectedOccasionIndex ?? 0]?.year},{" "}
                        {collision.course1.CourseOccasion?.[(collision.course1 as GuideCourseWithOccasion).selectedOccasionIndex ?? 0]?.semester}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-destructive/10 text-destructive rounded-md">
                      <span className="font-bold">
                        <Translate text="_period" /> {collision.periodIndex + 1}
                      </span>
                      <span className="opacity-30">•</span>
                      <span className="font-bold">
                        <Translate text="_block" /> {collision.blockIndex + 1}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 relative">
                    {([collision.course1, collision.course2] as GuideCourseWithOccasion[]).map((course, cIdx) => (
                      <div key={`${course.code}-${cIdx}`} className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-foreground tracking-tight">
                            {course.code} <span className="text-muted-foreground font-normal mx-0.5">—</span> <CourseTranslate text={course.name} />
                          </h5>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {course.CourseOccasion?.map((occ, oIdx) => {
                            const isSelected = (selectedOccasions[course.code] ?? 0) === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => onOccasionChange(course.code, oIdx)}
                                className={cn(
                                  "relative px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border shrink-0 cursor-pointer",
                                  isSelected
                                    ? "bg-primary/10 text-primary border-primary/20 ring-1 ring-primary/5"
                                    : "bg-muted/30 text-muted-foreground/60 border-transparent hover:bg-muted/60 hover:text-muted-foreground"
                                )}
                              >
                                <Translate text={occ.semester === "HT" ? "HT" : "VT"} /> {occ.year}
                              </button>
                            );
                          })}
                        </div>
                        
                        {cIdx === 0 && (
                          <div className="flex items-center gap-4 py-1 justify-center">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-destructive/20 to-transparent" />
                            <div className="bg-destructive/5 px-3 py-1 rounded-md border border-destructive/10 scale-90">
                              <span className="text-[9px] font-black text-destructive uppercase tracking-[0.1em]">
                                <Translate text="_collides_with" />
                              </span>
                            </div>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-destructive/20 to-transparent" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="h-24 w-24 rounded-[2rem] bg-emerald-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
                <Clock className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  <Translate text="_guide_collision_resolved" />
                </h3>
                <p className="text-muted-foreground max-w-[300px] leading-relaxed">
                  <Translate text="_guide_collision_resolved_desc" />
                </p>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter className="p-6 pb-2 shrink-0 flex flex-col sm:flex-row gap-3 border-t bg-muted/5">
          {hasCollisions ? (
            <>
              <AlertDialogCancel 
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                <Translate text="_guide_collision_review" />
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onContinueAnyway}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              >
                <Translate text="_guide_collision_continue" />
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction
              onClick={onContinueAnyway}
              className="bg-emerald-600 text-white hover:bg-emerald-700 w-full sm:w-auto cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Translate text="_guide_continue" />
                <ArrowRight className="h-4 w-4" />
              </div>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GuideCollisionDialog;
