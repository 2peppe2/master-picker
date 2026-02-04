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
import { useMemo, useState } from "react";

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
      name: string;
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
  }

  const programItems = useMemo(
    () =>
      programs.map((p) => ({
        label: `${p.shortname} - ${p.name}`,
        value: p.program,
      })),
    [programs],
  );
  const yearItems = useMemo(() => {
    if (!selectedProgram) return [];
    const program = programs.find((p) => p.program === selectedProgram);
    if (!program) return [];
    return program.programCourses.map((c) => c.startYear.toString());
  }, [programs, selectedProgram]);

  const masterItems = useMemo(() => {
    if (!selectedProgram) return [];
    const program = programs.find((p) => p.program === selectedProgram);
    if (!program) return [];
    return program.masters.map((m) => ({
      label: m.name,
      value: m.master,
    }));
  }, [programs, selectedProgram]);

  return (
    <div className="min-h-screen ">
      <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
        <Header />
        <div className="flex flex-col items-center gap-8">
          <Combobox
            items={programItems}
            value={
              programItems.find((item) => item.value === selectedProgram) || {
                label: "",
                value: "",
              }
            }
            onValueChange={(item) => setSelectedProgram(item?.value || null)}
          >
            <ComboboxInput
              placeholder="Select your current program"
              className="w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4"
            />
            <ComboboxContent>
              <ComboboxEmpty>No programs found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Combobox
            items={yearItems}
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <ComboboxInput
              disabled={selectedProgram === null}
              placeholder="Select starting year"
              aria-hidden={!selectedProgram}
              className={`w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4 transition-[opacity,transform] duration-200 ease-in-out ${
                selectedProgram
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
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
          <div
            className={`text-sm transition-[opacity,transform] duration-200 ease-in-out ${
              selectedYear
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
          >
            <Combobox
              items={masterItems}
              value={
                masterItems.find((item) => item.value === selectedMaster) || {
                  label: "",
                  value: "",
                }
              }
              onValueChange={(item) => setSelectedMaster(item?.value || null)}
            >
              <ComboboxInput
                disabled={selectedYear === null}
                placeholder="Select desired master"
                className={`w-80 h-12 [&_[data-slot=input-group-control]]:text-base md:[&_[data-slot=input-group-control]]:text-lg [&_[data-slot=input-group-control]]:px-4`}
              />

              <ComboboxContent>
                <ComboboxEmpty>Master not found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

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

          <Button
            variant="link"
            onClick={() => {}}
            className="text-sm"
          >
            Learn more about the project
          </Button>
        </div>
      </main>
    </div>
  );
};
export default LandingClientPage;

const Header = () => {
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center">
      <h1
        className="text-2xl md:text-6xl font-bold"
        style={{ fontFamily: '"DM Serif Text", serif' }}
      >
        LiU Master
      </h1>
      <p className="mb-8 max-w-xl text-center text-lg text-muted-foreground">
        Drop the crazy spreed sheets.
        <br />
        Embrace effortless course planning.
      </p>
    </header>
  );
};
