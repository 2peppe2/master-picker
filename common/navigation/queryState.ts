export const QUERY_PARAM = {
  language: "lang",
  master: "master",
  program: "program",
  schedule: "schedule",
  year: "year",
} as const;

export interface LandingQueryState {
  program: string | null;
  master: string | null;
  year: string | null;
}

export type LandingQueryUpdate = Partial<LandingQueryState>;

export const readLandingQuery = (
  params: Pick<URLSearchParams, "get">,
): LandingQueryState => ({
  program: params.get(QUERY_PARAM.program),
  master: params.get(QUERY_PARAM.master),
  year: params.get(QUERY_PARAM.year),
});

export const updateLandingQuery = (
  params: URLSearchParams,
  updates: LandingQueryUpdate,
) => {
  const next = new URLSearchParams(params);

  for (const [key, value] of Object.entries(updates)) {
    const param = QUERY_PARAM[key as keyof LandingQueryState];

    if (value === null) {
      next.delete(param);
    } else if (value !== undefined) {
      next.set(param, value);
    }
  }

  return next;
};
