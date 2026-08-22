/**
 * The civilingenjör programs we generate data for.
 *
 * `shortname` is what the UI shows next to the program; it follows LiTH's own
 * one-to-three letter section names (Y, M, I, ...), matching the existing
 * U/D/IT entries in data/programs.json.
 *
 * Excluded on purpose:
 *   6CIEN, 6CEDS, 6CMEA - no master profiles: their specializations dropdown
 *                         holds only "Alla", so no course is tagged per profile
 *   6CSYA, 6CSOL, 6CDUT - profiles are named in the syllabus, but the published
 *                         plan holds only the five term-1 courses and tags none
 *                         of them, so every profile comes out with an empty
 *                         requirement list. Revisit once LiU publishes the rest.
 */
export interface ProgramSpec {
  /**
   * How the app identifies the program: the LiU code, except for the
   * international programs, which publish one plan per language variant and so
   * need one entry each ("6CIEI-JA"). Names every data/ file, the
   * `program_<id>` locale key and the Program row.
   */
  id: string;
  /** studieinfo program code - every URL is built from this, never from `id`. */
  code: string;
  /** English program name, used for data/programs.json */
  name: string;
  /** Swedish program name, for the sv locale bundle. */
  swedishName?: string;
  shortname: string;
  /**
   * Picks this variant's revision out of the version dropdown, matched against
   * the Swedish option label ("HT 2022, Linköping, ... - internationell,
   * japanska"). Omitted for programs that publish one plan per year.
   */
  planLabel?: RegExp;
}

/**
 * The three programs the app shipped with. Kept as a separate list only to
 * record that history - the scraper skips any program-year already in
 * data/programs.json, whichever list it came from.
 */
export const EXISTING_PROGRAMS: ProgramSpec[] = [
  { id: "6CMJU", code: "6CMJU", name: "Software Engineering", swedishName: "Mjukvaruteknik", shortname: "U" },
  { id: "6CDDD", code: "6CDDD", name: "Data Science", swedishName: "Datateknik", shortname: "D" },
  { id: "6CITE", code: "6CITE", name: "Information Technology", swedishName: "Informationsteknologi", shortname: "IT" },
];

/**
 * The international programs run the same curriculum as their base program with
 * a language track bolted on, and studieinfo publishes a separate plan per
 * language. They are discontinued: 2022 has all four languages, 2023 only
 * Japanese, and nothing after that.
 */
const INTERNATIONAL_LANGUAGES: { suffix: string; english: string; swedish: string; label: RegExp }[] = [
  { suffix: "FR", english: "French", swedish: "franska", label: /franska/i },
  { suffix: "DE", english: "German", swedish: "tyska", label: /tyska/i },
  { suffix: "ES", english: "Spanish", swedish: "spanska", label: /spanska/i },
  { suffix: "JA", english: "Japanese", swedish: "japanska", label: /japanska/i },
];

function internationalVariants(
  code: string,
  englishName: string,
  swedishName: string,
  shortname: string,
): ProgramSpec[] {
  return INTERNATIONAL_LANGUAGES.map(({ suffix, english, swedish, label }) => ({
    id: `${code}-${suffix}`,
    code,
    name: `${englishName}, International (${english})`,
    swedishName: `${swedishName} - internationell, ${swedish}`,
    shortname: `${shortname}-${suffix.charAt(0)}${suffix.charAt(1).toLowerCase()}`,
    planLabel: label,
  }));
}

export const NEW_PROGRAMS: ProgramSpec[] = [
  { id: "6CYYY", code: "6CYYY", name: "Applied Physics and Electrical Engineering", swedishName: "Teknisk fysik och elektroteknik", shortname: "Y" },
  { id: "6CMMM", code: "6CMMM", name: "Mechanical Engineering", swedishName: "Maskinteknik", shortname: "M" },
  { id: "6CIII", code: "6CIII", name: "Industrial Engineering and Management", swedishName: "Industriell ekonomi", shortname: "I" },
  { id: "6CMED", code: "6CMED", name: "Biomedical Engineering", swedishName: "Medicinsk teknik", shortname: "MED" },
  { id: "6CDPU", code: "6CDPU", name: "Design and Product Development", swedishName: "Design och produktutveckling", shortname: "DPU" },
  { id: "6CEMM", code: "6CEMM", name: "Energy - Environment - Management", swedishName: "Energi - miljö - management", shortname: "EMM" },
  { id: "6CKEB", code: "6CKEB", name: "Chemical Biology", swedishName: "Kemisk biologi", shortname: "KB" },
  { id: "6CTBI", code: "6CTBI", name: "Engineering Biology", swedishName: "Teknisk biologi", shortname: "TB" },
  { id: "6CTMA", code: "6CTMA", name: "Engineering Mathematics", swedishName: "Teknisk matematik", shortname: "MAT" },
  // Norrköping, discontinued after the 2024 intake.
  { id: "6CMEN", code: "6CMEN", name: "Media Technology and Engineering", swedishName: "Medieteknik", shortname: "MT" },
  { id: "6CKTS", code: "6CKTS", name: "Communication and Transport Systems", swedishName: "Kommunikation, transport och samhälle", shortname: "KTS" },
  ...internationalVariants("6CIEI", "Industrial Engineering and Management", "Industriell ekonomi", "I"),
  ...internationalVariants("6CYYI", "Applied Physics and Electrical Engineering", "Teknisk fysik och elektroteknik", "Y"),
];

export const ALL_PROGRAMS = [...EXISTING_PROGRAMS, ...NEW_PROGRAMS];

export const DEFAULT_YEARS = [2022, 2023, 2024, 2025, 2026];

/**
 * 6CIII and 6CTMA expose two orthogonal specialisation axes in the same
 * dropdown: "Masterprofil" (chosen before term 7) and "Teknisk inriktning"
 * (chosen before term 4). A student picks one of each, so they are not
 * comparable as master badges. We keep only the master profiles, which is what
 * "master" means everywhere else in the app.
 */
export const MASTER_PROFILE_ONLY = new Set(["6CIII", "6CIEI", "6CTMA"]);

const ORIENTATION_PREFIXES = ["Teknisk inriktning", "Technical specialisation", "Technical specialization"];

export function isTechnicalOrientation(name: string) {
  return ORIENTATION_PREFIXES.some((p) => name.trim().startsWith(p));
}

/**
 * 6CIEI and 6CYYI put their language tracks (IFRA/IJAP/..., YFRA/YJAP/...) in
 * the same dropdown as the master profiles. A student's language is fixed by
 * which variant they were admitted to, so it is not a master to pick.
 */
const LANGUAGE_TRACKS =
  /^(franska|tyska|spanska|japanska|kinesiska|french|german|spanish|japanese|chinese)$/i;

export function isLanguageTrack(name: string) {
  return LANGUAGE_TRACKS.test(name.trim());
}

/** "Masterprofil Finans" -> "Finans"; leaves other programs' names untouched. */
export function stripProfilePrefix(name: string) {
  return name
    .trim()
    .replace(/^(Masterprofil|Master['’]?s? profile|Master profile)\s+/i, "")
    .trim();
}

/**
 * The name to show a student. 6CIII and 6CTMA name their host-department
 * profiles "Masterprofil med huvudområde Elektroteknik" / "Master's profile in
 * Electrical Engineering (contact study counsellor)", which strips down to the
 * useless "med huvudområde ..." / "in ...". 6CMEN appends a campus note to one
 * profile ("... (Termin 9 Campus Valla)"), which is scheduling detail rather
 * than part of the name. Only used for display and locale keys -
 * `sliceByProfile` in parseRequirements.ts anchors on the longer form, which is
 * far less likely to collide with a main-field name in the prose.
 */
export function cleanProfileName(name: string) {
  return stripProfilePrefix(name)
    .replace(/^(med huvudområde|in)\s+/i, "")
    .replace(/\s*\((kontakta studievägledare|contact study counsell?or)\)$/i, "")
    .replace(/\s*\((termin|semester)\s+\d+\s+campus\s+[^)]+\)$/i, "")
    .trim();
}

/** Looks a program up by its app id ("6CIEI-JA"), not its studieinfo code. */
export function findProgram(id: string): ProgramSpec {
  const program = ALL_PROGRAMS.find((p) => p.id === id.toUpperCase());
  if (!program) {
    throw new Error(
      `Unknown program ${id}. Known: ${ALL_PROGRAMS.map((p) => p.id).join(", ")}`,
    );
  }
  return program;
}
