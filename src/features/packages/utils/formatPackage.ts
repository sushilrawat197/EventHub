import type { TourPackage } from "../types/package";

export function formatPackagePrice(amount: number, currency: string): string {
  const formatted = Number(amount).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  if (currency === "LSL") return `M${formatted}`;
  return `${currency} ${formatted}`;
}

export function formatDuration(nights: number, days: number): string {
  return `${days}D / ${nights}N`;
}

export function formatDeparture(date: string | undefined): string {
  if (!date) return "";
  const parsed = parseIsoDate(date);
  if (!parsed) return date;
  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function parseIsoDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatPricingBasis(basis: string): string {
  if (basis === "PER_PERSON") return "per person";
  return formatLabel(basis).toLowerCase();
}

export function formatLabel(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatClock(time: string | null | undefined): string {
  if (!time) return "";
  const [rawHour, rawMinute] = time.split(":");
  const hour24 = Number(rawHour);
  if (Number.isNaN(hour24)) return time;
  const minute = rawMinute ?? "00";
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
}

export function packagePath(pkg: TourPackage): string {
  const slug = pkg.packageName
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `/packages/${slug}/${pkg.packageId}`;
}
