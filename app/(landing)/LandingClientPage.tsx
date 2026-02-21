"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ComboboxItemType } from "./types";
import GenericCombobox from "./GenericComboBox";

interface LandingClientPageProps {
  programs: {
    program: string;
    name: string;
    shortname: string;
    programCourses: {
      startYear: number;
    }[];
    masters: {
      master: string;
      name: string | null;
    }[];
  }[];
}

const LandingClientPage = ({ programs }: LandingClientPageProps) => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const router = useRouter();

  const pushToGuide = () => {
    if (!selectedProgram || !selectedYear || !selectedMaster) return;
    const params = new URLSearchParams({
      program: selectedProgram,
      year: selectedYear,
      master: selectedMaster,
    });
    router.push(`/guide?${params.toString()}`);
  };
  const pushToDashboard = () => {
    if (!selectedProgram || !selectedYear) return;
    const params = new URLSearchParams({
      program: selectedProgram,
      year: selectedYear,
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  const programItems: ComboboxItemType[] = useMemo(
    () =>
      programs.map((p) => ({
        label: `${p.shortname} - ${p.name}`,
        value: p.program,
      })),
    [programs],
  );
  const yearItems: ComboboxItemType[] = useMemo(() => {
    if (!selectedProgram) return [];
    const program = programs.find((p) => p.program === selectedProgram);
    if (!program) return [];
    return program.programCourses.map((c) => ({
      label: c.startYear.toString(),
      value: c.startYear.toString(),
    }));
  }, [programs, selectedProgram]);

  const masterItems: ComboboxItemType[] = useMemo(() => {
    if (!selectedProgram) return [];
    const program = programs.find((p) => p.program === selectedProgram);
    if (!program) return [];
    return program.masters.map((m) => ({
      label: m.name ?? m.master,
      value: m.master,
    }));
  }, [programs, selectedProgram]);

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
        onValueChange={(item: ComboboxItemType | null) =>
          setSelectedProgram(item?.value || null)
        }
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
        onValueChange={(item: ComboboxItemType | null) =>
          setSelectedYear(item?.value || null)
        }
        placeholder="Select starting year"
        noResultsText="No years found."
        className={
          selectedProgram
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }
      />

      <div
        className={`text-sm transition-[opacity,transform] duration-200 ease-in-out ${
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
          noResultsText="No masters found."
        />
        <Button variant="link" onClick={pushToDashboard}>
          {`Pick master later`}
        </Button>
      </div>

      <Button
        disabled={
          selectedProgram === null ||
          selectedYear === null ||
          selectedMaster === null
        }
        onClick={pushToGuide}
        className="w-80 h-12 text-base md:text-lg"
      >
        Get started
      </Button>

      <Button variant="link" onClick={() => {}} className="text-sm">
        Learn more about the project
      </Button>
    </div>
  );
};
export default LandingClientPage;


