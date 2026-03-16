"use client";

import { useGeneratePrefilledSchedule } from "@/app/dashboard/(store)/schedule/hooks/useGeneratePrefilledSchedule";
import { serializeSchedule } from "@/app/dashboard/(store)/schedule/utils";
import { getBachelorCourses } from "../actions/getBachelorCourses";
import { normalizeCourse } from "@/app/courseNormalizer";
import { Button } from "@/components/ui/button";
import GenericCombobox from "./GenericComboBox";
import { FC, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComboboxItemType } from "./types";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface LandingClientPageProps {
  programs: {
    id: string;
    name: string;
    shortname: string;
    years: {
      year: number;
      masters: {
        id: string;
        name: string | null;
      }[];
    }[];
  }[];
}

const LandingClientPage: FC<LandingClientPageProps> = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  const router = useRouter();
  const generateGrid = useGeneratePrefilledSchedule();

  const pushToGuide = () => {
    if (!selectedProgram || !selectedYear || !selectedMaster) return;
    setIsLoadingGuide(true);
    const params = new URLSearchParams({
      program: selectedProgram,
      year: selectedYear,
      master: selectedMaster,
    });
    router.push(`/guide?${params.toString()}`);
  };

  const pushToDashboard = async () => {
    if (!selectedProgram || !selectedYear) return;
    setIsLoadingDashboard(true);

    try {
      const bachelorCourses = (
        await getBachelorCourses(selectedProgram, parseInt(selectedYear))
      ).map((c) => normalizeCourse(c));

      const coursesMap = Object.fromEntries(
        bachelorCourses.map((c) => [c.code, c]),
      );

      const newGrid = generateGrid({ courses: bachelorCourses });
      const compressed = serializeSchedule(coursesMap, newGrid);

      const params = new URLSearchParams({
        program: selectedProgram,
        year: selectedYear,
      });

      if (compressed) {
        params.set("schedule", compressed);
      }

      router.push(`/dashboard?${params.toString()}`);
    } catch (error) {
      console.error("Failed to prefill bachelor schedule:", error);
      router.push(`/dashboard?program=${selectedProgram}&year=${selectedYear}`);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const programItems: ComboboxItemType[] = useMemo(
    () =>
      programs.map((p) => ({
        label: `${p.shortname} - ${p.name}`,
        value: p.id,
      })),
    [programs],
  );

  const yearItems: ComboboxItemType[] = useMemo(() => {
    if (!selectedProgram) return [];
    const program = programs.find((p) => p.id === selectedProgram);
    if (!program) return [];

    return program.years.map((y) => ({
      label: y.year.toString(),
      value: y.year.toString(),
    }));
  }, [programs, selectedProgram]);

  const masterItems: ComboboxItemType[] = useMemo(() => {
    if (!selectedProgram || !selectedYear) return [];

    const program = programs.find((p) => p.id === selectedProgram);
    if (!program) return [];

    const yearData = program.years.find(
      (y) => y.year.toString() === selectedYear,
    );
    if (!yearData) return [];

    return yearData.masters.map((m) => ({
      label: m.name ?? m.id,
      value: m.id,
    }));
  }, [programs, selectedProgram, selectedYear]);

  return (
    <div className="flex flex-col items-center gap-8">
      <GenericCombobox
        items={programItems}
        value={
          programItems.find((item) => item.value === selectedProgram) || {
            label: "",
            value: "",
          }
        }
        onValueChange={(item: ComboboxItemType | null) => {
          setSelectedProgram(item?.value || null);
          setSelectedYear(null);
          setSelectedMaster(null);
        }}
        placeholder="Select your current program"
        noResultsText="No programs found."
      />

      <GenericCombobox
        items={yearItems}
        value={
          yearItems.find((item) => item.value === selectedYear) || {
            label: "",
            value: "",
          }
        }
        onValueChange={(item: ComboboxItemType | null) => {
          setSelectedYear(item?.value || null);
          setSelectedMaster(null);
        }}
        placeholder="Select starting year"
        noResultsText="No years found."
        className={
          selectedProgram
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }
      />

      <div
        className={`flex flex-col items-center gap-2 text-sm transition-[opacity,transform] duration-200 ease-in-out ${
          selectedYear
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <GenericCombobox
          items={masterItems}
          value={
            masterItems.find((item) => item.value === selectedMaster) || {
              label: "",
              value: "",
            }
          }
          onValueChange={(item: ComboboxItemType | null) =>
            setSelectedMaster(item?.value || null)
          }
          placeholder="Select desired master"
          noResultsText="No masters found for this year."
        />

        <Button
          variant="link"
          onClick={pushToDashboard}
          disabled={isLoadingDashboard}
        >
          {isLoadingDashboard ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Pick master later"
          )}
        </Button>
      </div>

      <Button
        disabled={
          selectedProgram === null ||
          selectedYear === null ||
          selectedMaster === null ||
          isLoadingGuide
        }
        onClick={pushToGuide}
        className="w-80 h-12 text-base md:text-lg"
      >
        {isLoadingGuide ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Get started"
        )}
      </Button>

      <Button variant="link" className="text-sm">
        <Link href="/about">Learn more about the project</Link>
      </Button>
    </div>
  );
};

export default LandingClientPage;
