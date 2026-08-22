import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/** Must stay identical to `toKey` in prisma/seed.ts. */
export function toKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export type LocaleBundle = Record<string, string>;

export class LocaleCollector {
  readonly en: LocaleBundle = {};
  readonly sv: LocaleBundle = {};

  add(key: string, english: string, swedish: string) {
    if (english) this.en[key] ??= english;
    if (swedish) this.sv[key] ??= swedish;
  }

  course(code: string, english: string, swedish: string) {
    this.add(`${code.toLowerCase()}_name`, english, swedish);
  }

  master(id: string, english: string, swedish: string) {
    this.add(`master_${id}`, english, swedish);
  }

  program(code: string, english: string, swedish: string) {
    this.add(`program_${code}`, english, swedish);
  }

  mainField(english: string, swedish: string) {
    if (english) this.add(`field_${toKey(english)}`, english, swedish || english);
  }

  examination(english: string, swedish: string) {
    if (english) this.add(`exam_${toKey(english)}`, english, swedish || english);
  }
}

/**
 * Merge into public/locales/{lang}/courses.json without clobbering: existing
 * values win, so hand-tuned translations survive a re-scrape.
 */
export async function mergeLocales(collector: LocaleCollector, root: string) {
  const summary: Record<string, number> = {};

  for (const lang of ["en", "sv"] as const) {
    const file = path.join(root, "public", "locales", lang, "courses.json");
    const current: LocaleBundle = JSON.parse(await readFile(file, "utf-8"));
    const incoming = collector[lang];

    // Append rather than sort, so the diff shows only the new keys.
    let added = 0;
    for (const key of Object.keys(incoming).sort()) {
      if (current[key] === undefined) {
        current[key] = incoming[key];
        added++;
      }
    }

    await writeFile(file, JSON.stringify(current, null, 2), "utf-8");
    summary[lang] = added;
  }

  return summary;
}
