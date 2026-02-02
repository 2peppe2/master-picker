"use client";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LandingClientPageProps {
  programs: {
    program: string;
    name: string;
    shortname: string;
    programCourses: {
      startYear: number;
    }[];
  }[];
}

const LandingClientPage = ({ programs }: LandingClientPageProps) => {
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const router = useRouter();

  const handleGetStarted = () => {
    if (!selectedProgram || !selectedYear) return;
    const params = new URLSearchParams({
      program: selectedProgram,
      year: selectedYear,
    });
    router.push(`/dashboard?${params.toString()}`);
  };
  return (
    <div className="min-h-screen ">
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <h1
          className="text-2xl md:text-6xl font-bold"
          style={{ fontFamily: '"DM Serif Text", serif' }}
        >
          LiU Master
        </h1>
        <p className="mb-8 max-w-xl text-center text-lg text-muted-foreground">
            Helping students plan their master&apos;s degree with ease
        </p>

        <div className="flex flex-col items-center gap-8">
          <Combobox
            items={programs.map((p) => `${p.shortname} - ${p.name}`)}
            value={selectedProgram}
            onValueChange={setSelectedProgram}
          >
            <ComboboxInput
              placeholder="Select your current program"
              className="w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4"
            />
            <ComboboxContent>
              <ComboboxEmpty>No programs found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Combobox
            items={
              selectedProgram
                ? programs
                    .find((p) => p.program === selectedProgram)
                    ?.programCourses.map((c) => c.startYear.toString()) ?? []
                : []
            }
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <ComboboxInput
              disabled={selectedProgram === null}
              placeholder="Select starting year"
              className="w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4"
            />

            <ComboboxContent>
              <ComboboxEmpty>Year not found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Button
            disabled={selectedProgram === null || selectedYear === null}
            onClick={handleGetStarted}
            className="w-80 h-12 text-base md:text-lg"
          >
            Get started
          </Button>
        </div>
      </main>
    </div>
  );
};
export default LandingClientPage;