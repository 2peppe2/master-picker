import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "liu");
const MAX_CONCURRENT = 2;
const DELAY_MS = 400;
const MAX_ATTEMPTS = 5;

let useCache = true;
export function setCacheEnabled(enabled: boolean) {
  useCache = enabled;
}

let inFlight = 0;
const queue: (() => void)[] = [];

function acquire(): Promise<void> {
  if (inFlight < MAX_CONCURRENT) {
    inFlight++;
    return Promise.resolve();
  }
  return new Promise((resolve) => queue.push(resolve));
}

function release() {
  const next = queue.shift();
  if (next) {
    next();
  } else {
    inFlight--;
  }
}

function cachePath(url: string) {
  return path.join(CACHE_DIR, `${createHash("sha1").update(url).digest("hex")}.html`);
}

const NOT_FOUND = "<!-- 404 -->";

/**
 * studieinfo answers some missing pages with a styled 200 page rather than a
 * 404 status, so a missing program plan can look like a successful fetch.
 */
export function isNotFound(html: string) {
  return html === NOT_FOUND || html.includes("<title>404 Sidan kunde inte hittas");
}

export async function fetchPage(url: string): Promise<string> {
  const file = cachePath(url);

  if (useCache) {
    try {
      return await readFile(file, "utf-8");
    } catch {
      // not cached yet
    }
  }

  await acquire();
  try {
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "master-picker-data-scraper (https://github.com/2peppe2/master-picker)",
          },
        });

        // Rate limited: wait noticeably longer before trying again.
        if (res.status === 429) {
          const retryAfter = Number(res.headers.get("retry-after"));
          const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 5000 * 2 ** attempt;
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }

        // A course page that does not exist for a given term is an expected
        // outcome, not a failure: return a sentinel so isNotFound() handles it.
        if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status} for ${url}`);
        const html = res.status === 404 ? NOT_FOUND : await res.text();
        await mkdir(CACHE_DIR, { recursive: true });
        await writeFile(file, html, "utf-8");
        await new Promise((r) => setTimeout(r, DELAY_MS));
        return html;
      } catch (error) {
        lastError = error;
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    throw lastError ?? new Error(`Gave up after ${MAX_ATTEMPTS} attempts: ${url}`);
  } finally {
    release();
  }
}

const BASE = "https://studieinfo.liu.se";

export const urls = {
  programLatest: (code: string) => `${BASE}/program/${code}`,
  programPlan: (code: string, planId: number, lang: "sv" | "en") =>
    lang === "en" ? `${BASE}/en/program/${code}/${planId}` : `${BASE}/program/${code}/${planId}`,
  /** The syllabus section of a plan - where the profile/degree rules are published. */
  programSyllabus: (code: string, planId: number) =>
    `${BASE}/program/${code}/${planId}#syllabus`,
  course: (code: string, term: string, lang: "sv" | "en") =>
    lang === "en" ? `${BASE}/en/kurs/${code}/${term}` : `${BASE}/kurs/${code}/${term}`,
};
