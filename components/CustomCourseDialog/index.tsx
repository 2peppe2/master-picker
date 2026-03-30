"use client";

import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";
import { normalizeCustomCourse } from "@/app/dashboard/(store)/customCourses/utils";
import { scheduleAtoms } from "@/app/dashboard/(store)/schedule/atoms";
import Translate from "@/common/components/translate/Translate";
import { coursesAtom } from "@/app/dashboard/(store)/store";
import {
  customCoursesAtoms,
  CustomCourseInput,
} from "@/app/dashboard/(store)/customCourses/atoms";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { produce } from "immer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CustomCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseToEdit?: CustomCourseInput | null;
}

const CustomCourseDialog: FC<CustomCourseDialogProps> = ({
  open,
  onOpenChange,
  courseToEdit,
}) => {
  const [customCourses, setCustomCourses] = useAtom(
    customCoursesAtoms.customCoursesAtom,
  );
  const [schedules, setSchedules] = useAtom(scheduleAtoms.schedulesAtom);
  const [courses, setCourses] = useAtom(coursesAtom);
  const translate = useCommonTranslate();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [hp, setHp] = useState<string>("7.5");

  useEffect(() => {
    if (open) {
      if (courseToEdit) {
        setCode(courseToEdit.code);
        setName(courseToEdit.name);
        setHp(courseToEdit.hp.toString());
      } else {
        setCode("");
        setName("");
        setHp("7.5");
      }
    }
  }, [open, courseToEdit]);

  const handleSave = () => {
    const parsedHp = parseFloat(hp);
    if (isNaN(parsedHp)) return;

    const input: CustomCourseInput = { code, name, hp: parsedHp };
    const normalized = normalizeCustomCourse(input);

    let newCustomCourses = [...customCourses];

    if (courseToEdit) {
      // Editing
      newCustomCourses = newCustomCourses.map((c) =>
        c.code === courseToEdit.code ? input : c,
      );

      const newCourses = { ...courses };
      if (courseToEdit.code !== code) {
        delete newCourses[`custom_${courseToEdit.code}`];
      }
      newCourses[normalized.code] = normalized;
      setCourses(newCourses);

      // Update in schedule
      setSchedules((prev) =>
        produce(prev, (draft) => {
          draft.forEach((semester) => {
            semester.forEach((period) => {
              period.forEach((slot, index) => {
                if (
                  slot?.code === normalized.code ||
                  slot?.code === `custom_${courseToEdit.code}`
                ) {
                  period[index] = normalized;
                }
              });
            });
          });
        }),
      );
    } else {
      // Creating
      if (customCourses.some((c) => c.code === code)) {
        return;
      }
      newCustomCourses.push(input);
      setCourses({ ...courses, [normalized.code]: normalized });
    }

    setCustomCourses(newCustomCourses);
    onOpenChange(false);
  };

  const handleAddToWildcard = () => {
    if (!code || !name || !hp) return;

    const parsedHp = parseFloat(hp);
    if (isNaN(parsedHp)) return;

    const input: CustomCourseInput = { code, name, hp: parsedHp };
    const normalized = normalizeCustomCourse(input);

    // Ensure it's in the atoms
    if (!customCourses.some((c) => c.code === code)) {
      setCustomCourses((prev) => [...prev, input]);
      setCourses((prev) => ({ ...prev, [normalized.code]: normalized }));
    }

    setSchedules((prev) =>
      produce(prev, (draft) => {
        // Find the first semester and first period to add it to as a wildcard
        // Or we can just find any available wildcard slot.
        // For simplicity, let's add it to the first semester's first period extra slot.
        if (draft[0] && draft[0][0]) {
          let placed = false;
          const periodBlocks = draft[0][0];
          const wildcardStart = 4; // Standard blocks are 0-3

          for (let i = wildcardStart; i < periodBlocks.length; i++) {
            if (periodBlocks[i] === null) {
              periodBlocks[i] = normalized;
              placed = true;
              break;
            }
          }

          if (!placed) {
            draft[0].forEach((p, idx) => {
              p.push(idx === 0 ? normalized : null);
            });
          }
        }
      }),
    );

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {courseToEdit ? (
              <Translate text="edit_custom_course" />
            ) : (
              <Translate text="add_custom_course" />
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              <Translate text="course_code_short" />
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
              disabled={!!courseToEdit}
              placeholder="e.g. EX0001"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              <Translate text="course_name" />
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. My Custom Course"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hp" className="text-right">
              <Translate text="credits" />
            </Label>
            <Input
              id="hp"
              type="number"
              step="0.5"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex-1 flex gap-2">
            {!courseToEdit && (
              <Button
                variant="secondary"
                onClick={handleAddToWildcard}
                disabled={!code || !name || !hp}
              >
                <Translate text="add_to_new_block" />
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <Translate text="cancel" />
            </Button>
            <Button onClick={handleSave} disabled={!code || !name || !hp}>
              <Translate text="save" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCourseDialog;
