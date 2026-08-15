/**
 * Option values are encoded as `prefix:value`. A negated option keeps the same
 * prefix and marks the value instead -- `examination:!lab` -- so both
 * polarities of a dimension consolidate into a single badge.
 */
export const NEGATION_MARKER = "!";

export const encodeOptionValue = (
  prefix: string,
  value: string | number,
  { negated = false }: { negated?: boolean } = {},
) => `${prefix}:${negated ? NEGATION_MARKER : ""}${value}`;

/** The same option with the other polarity: `level:A` <-> `level:!A`. */
export const oppositeOptionValue = (raw: string) => {
  const { prefix, value, negated } = parseOptionValue(raw);

  return encodeOptionValue(prefix, value, { negated: !negated });
};

export const parseOptionValue = (raw: string) => {
  const [prefix, ...rest] = raw.split(":");
  const value = rest.join(":");
  const negated = value.startsWith(NEGATION_MARKER);

  return {
    prefix,
    value: negated ? value.slice(NEGATION_MARKER.length) : value,
    negated,
  };
};
