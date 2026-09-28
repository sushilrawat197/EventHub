import type {
  PackageActivity,
  PackageDeparture,
  PackageDetail,
  PackagePickupPoint,
  PackageTransport,
} from "../types/packageDetail";

const FRIENDLY_LABELS: Record<string, string> = {
  PER_PERSON: "Per person",
  PER_GROUP: "Per group",
  PER_ROOM: "Per room",
  BANK_TRANSFER: "Bank transfer",
  NON_REFUNDABLE: "Non-refundable",
  REFUNDABLE: "Refundable",
  PARTIALLY_REFUNDABLE: "Partially refundable",
  FIXED_AMOUNT: "Fixed amount",
  PERCENTAGE: "Percentage",
  MPESA: "M-Pesa",
  ECOCASH: "EcoCash",
  CARD: "Card",
  CASH: "Cash",
  OTHER: "Other",
  INCLUDED: "Included",
  OPTIONAL: "Optional",
  ADD_ON: "Add-on",
  ADULT: "Adult",
  CHILD: "Child",
  INFANT: "Infant",
  SENIOR: "Senior",
};

/** Trimmed text, or undefined when empty / null / the literal strings "null" or "undefined". */
export function clean(value: string | null | undefined): string | undefined {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return undefined;
  return trimmed;
}

/** Split a free-text field into list items when it contains line breaks or bullets. */
export function textItems(value: string | null | undefined): string[] {
  const text = clean(value);
  if (!text) return [];
  const parts = text
    .split(/\r?\n|•|·/)
    .map((part) => part.replace(/^[-–]\s*/, "").trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [text];
}

export function friendlyLabel(code: string | null | undefined): string | undefined {
  const value = clean(code);
  if (!value) return undefined;
  const key = value.toUpperCase();
  if (FRIENDLY_LABELS[key]) return FRIENDLY_LABELS[key];
  const words = value.replace(/[_-]+/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function formatMoney(amount: number | null | undefined, currency: string | null | undefined): string | undefined {
  if (amount == null || Number.isNaN(Number(amount))) return undefined;
  const code = clean(currency) ?? "LSL";
  const hasCents = Number(amount) % 1 !== 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    })
      .format(Number(amount))
      .replace(/\u00a0/g, " ");
  } catch {
    return `${code} ${Number(amount).toLocaleString("en-US")}`;
  }
}

function toDate(value: string | null | undefined): Date | undefined {
  const raw = clean(value);
  if (!raw) return undefined;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "28 Sep 2026" (built by hand because some en-GB locales emit "Sept"). */
export function formatDate(value: string | null | undefined): string | undefined {
  const date = toDate(value);
  if (!date) return undefined;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** "14:28:00" -> "2:28 PM" */
export function formatTime(value: string | null | undefined): string | undefined {
  const raw = clean(value);
  if (!raw) return undefined;
  const [rawHour, rawMinute = "00"] = raw.split(":");
  const hour = Number(rawHour);
  if (Number.isNaN(hour)) return raw;
  return `${hour % 12 || 12}:${rawMinute.padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

export function formatTimeRange(start: string | null | undefined, end: string | null | undefined): string | undefined {
  const from = formatTime(start);
  const to = formatTime(end);
  if (from && to) return `${from} – ${to}`;
  return from ?? to;
}

/** Inclusive calendar days between two dates, e.g. 28 Sep → 30 Sep = 3 days. */
export function daysBetween(start: string | null | undefined, end: string | null | undefined): number | undefined {
  const from = toDate(start);
  const to = toDate(end);
  if (!from || !to) return undefined;
  const diff = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  return diff >= 0 ? diff + 1 : undefined;
}

export function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function formatDurationLabel(days?: number | null, nights?: number | null): string | undefined {
  const parts: string[] = [];
  if (days) parts.push(plural(days, "Day"));
  if (nights) parts.push(plural(nights, "Night"));
  return parts.length ? parts.join(" / ") : undefined;
}

export function formatActivityDuration(activity: PackageActivity): string | undefined {
  if (!activity.durationValue) return undefined;
  const unit = friendlyLabel(activity.durationUnit)?.toLowerCase();
  return unit ? `${activity.durationValue} ${unit}` : String(activity.durationValue);
}

export function formatAgeRange(min?: number | null, max?: number | null): string | undefined {
  if (min != null && max != null) return `${min}–${max} yrs`;
  if (min != null) return `${min}+ yrs`;
  if (max != null) return `Up to ${max} yrs`;
  return undefined;
}

export function initials(name: string | null | undefined): string {
  const words = (clean(name) ?? "").split(/\s+/).filter(Boolean);
  return (words.slice(0, 2).map((word) => word[0]).join("") || "TO").toUpperCase();
}

export function byDisplayOrder<T extends { displayOrder?: number | null }>(list: T[] | null | undefined): T[] {
  return [...(list ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export interface DepartureView {
  key: string;
  start?: string;
  end?: string;
  days?: number;
  status?: string;
  statusCode: string;
  seatsLeft?: number;
  note?: string;
  bookable: boolean;
}

export function normalizeDepartures(list: PackageDeparture[] | null | undefined): DepartureView[] {
  return [...(list ?? [])]
    .sort((a, b) => (a.departureDate ?? "").localeCompare(b.departureDate ?? ""))
    .map((departure) => {
      const statusCode = (clean(departure.status) ?? "OPEN").toUpperCase();
      return {
        key: String(departure.departureId),
        start: formatDate(departure.departureDate),
        end: formatDate(departure.returnDate),
        days: daysBetween(departure.departureDate, departure.returnDate),
        status: friendlyLabel(statusCode),
        statusCode,
        seatsLeft: departure.availableSeats ?? undefined,
        note: clean(departure.notes),
        bookable: statusCode === "OPEN" || statusCode === "AVAILABLE" || statusCode === "LIMITED",
      };
    })
    .filter((departure) => departure.start);
}

export interface TransportView {
  key: string;
  dayNumber?: number;
  mode?: string;
  modeCode: string;
  vehicle?: string;
  from?: string;
  to?: string;
  route?: string;
  capacity?: number;
  included: boolean;
  pickupIncluded: boolean;
  dropOffIncluded: boolean;
  description?: string;
}

export function normalizeTransport(list: PackageTransport[] | null | undefined): TransportView[] {
  return byDisplayOrder(list ?? []).map((item) => {
    const from = clean(item.fromCityName);
    const to = clean(item.toCityName);
    return {
      key: String(item.transportId),
      dayNumber: item.dayNumber ?? undefined,
      mode: clean(item.transportTypeName) ?? friendlyLabel(item.transportTypeCode ?? item.vehicleType),
      modeCode: (clean(item.transportTypeCode) ?? clean(item.vehicleType) ?? "").toUpperCase(),
      vehicle: clean(item.vehicleDescription) ?? clean(item.vehicleType),
      from,
      to,
      route: from && to ? (from === to ? `Within ${from}` : `${from} → ${to}`) : (from ?? to),
      capacity: item.vehicleCapacity ?? undefined,
      included: item.transportIncluded !== false,
      pickupIncluded: Boolean(item.pickupRequired),
      dropOffIncluded: Boolean(item.dropoffRequired),
      description: clean(item.description),
    };
  });
}

export interface PickupView {
  key: string;
  departureId?: number;
  name?: string;
  address?: string;
  city?: string;
  time?: string;
  type?: string;
  instructions?: string;
}

export function normalizePickupPoints(list: PackagePickupPoint[] | null | undefined): PickupView[] {
  return byDisplayOrder((list ?? []).filter((point) => point.active !== false))
    .map((point) => ({
      key: String(point.pickupPointId),
      departureId: point.departureId ?? undefined,
      name: clean(point.name),
      address: clean(point.address),
      city: [clean(point.cityName), clean(point.regionName)]
        .filter((value, index, values) => value && values.indexOf(value) === index)
        .join(", ") || undefined,
      time: formatTime(point.pickupTime),
      type: friendlyLabel(point.pickupType),
      instructions: clean(point.instructions),
    }))
    .filter((point) => point.name || point.address);
}

export function activeActivities(pkg: PackageDetail): PackageActivity[] {
  return byDisplayOrder((pkg.activities ?? []).filter((activity) => activity.active !== false));
}
