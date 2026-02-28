"use client";

import { Button } from "@/components/ui/button";
import GenericCombobox from "./GenericComboBox";
import { useRouter } from "next/navigation";
import { ComboboxItemType } from "./types";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import '@/lib/i18n';
import { useTranslation } from "react-i18next";

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
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);

  const router = useRouter();

  const { t } = useTranslation("common");

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

  const pushToDashboard = () => {
    if (!selectedProgram || !selectedYear) return;
    setIsLoadingDashboard(true);
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
        onValueChange={(item: ComboboxItemType | null) => {
          setSelectedProgram(item?.value || null);
          setSelectedYear(null);
          setSelectedMaster(null);
        }}
        placeholder={t("selectProgramPlaceholder")}
        noResultsText={t("noProgramsFound")}
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
        placeholder={t("selectYearPlaceholder")}
        noResultsText={t("noYearsFound")}
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
          placeholder={t("selectMasterPlaceholder")}
          noResultsText={t("noMastersFound")}
        />

        <Button
          variant="link"
          onClick={pushToDashboard}
          disabled={isLoadingDashboard}
        >
          {isLoadingDashboard ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("loading")}
            </>
          ) : (
            t("dashboardButton")
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
            {t("loading")}
          </>
        ) : (
          t("getStartedButton")
        )}
      </Button>

      <Button variant="link" className="text-sm">
        <Link href="/about">{t("aboutLink")}</Link>
      </Button>
    </div>
  );
};

export default LandingClientPage;
