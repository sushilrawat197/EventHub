/** Shared browse-events filter option lists (UI labels / API values). */

export const CATEGORY_OPTIONS = [
  "FOOD",
  "KIDS_EVENT",
  "SPORTS",
  "GALA_DINNER",
  "COMEDY",
  "SEMINARS",
  "FESTIVAL",
  "WORKSHOP",
  "LIFESTYLE",
  "OUTDOOR",
  "INDOOR",
  "OTHER",
] as const;

export const DATE_OPTIONS = ["TODAY", "TOMORROW", "WEEKEND", "DATE RANGE"] as const;

export const LANGUAGE_OPTIONS = ["English", "Sesotho"] as const;

export const PRICE_OPTIONS = ["0 - 500", "501 - 2000", "Above 2000"] as const;

export type PriceGroup = { min: number; max: number };

export function mapPriceLabelsToGroups(labels: string[]): PriceGroup[] {
  return labels.map((f) => {
    if (f === "0 - 500") return { min: 0, max: 500 };
    if (f === "501 - 2000") return { min: 501, max: 2000 };
    if (f === "Above 2000") return { min: 2001, max: Number.MAX_SAFE_INTEGER };
    return { min: 0, max: Number.MAX_SAFE_INTEGER };
  });
}

export function formatFilterLabel(tag: string): string {
  return tag.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
