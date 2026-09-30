import type { PackageActivity, PackageDetail } from "../types/packageDetail";
import type {
  PackageReservationRequest,
  ReservationGuest,
  ReservationTraveller,
  TravellerType,
} from "../types/packageReservation";
import { activeActivities, clean, friendlyLabel } from "./packageDetailFormat";

export const TITLES = ["Mr", "Mrs", "Ms", "Miss", "Master", "Dr"] as const;
export const DEFAULT_COUNTRY_CODE = "+266";
export const MAX_PER_TYPE = 10;

/** True when every child and infant has an age. Preview cannot be quoted until this is true. */
export function childAgesComplete(
  options: TravellerOption[],
  counts: Record<string, number>,
  ages: Record<string, number[]>,
): boolean {
  return options.every((option) => {
    if (!option.needsAge) return true;
    const quantity = counts[option.type] ?? 0;
    for (let index = 0; index < quantity; index += 1) {
      if (ages[option.type]?.[index] == null) return false;
    }
    return true;
  });
}

/** Travellers with a quantity. Children send `ages`; infants send a single `age`. */
export function travellersFromCounts(
  options: TravellerOption[],
  counts: Record<string, number>,
  ages: Record<string, number[]> = {},
): ReservationTraveller[] {
  return options.flatMap((option): ReservationTraveller[] => {
    const quantity = Math.max(0, Math.floor(counts[option.type] ?? 0));
    if (quantity <= 0) return [];
    const selected = (ages[option.type] ?? []).slice(0, quantity).filter((age) => Number.isFinite(age));
    if (option.type === "INFANT") {
      return [selected[0] == null ? { type: option.type, quantity } : { type: option.type, quantity, age: selected[0] }];
    }
    if (option.needsAge) return [{ type: option.type, quantity, ages: selected }];
    return [{ type: option.type, quantity }];
  });
}

/** `ADULT:1,CHILD:1:10,INFANT:1:1` — counts, plus child ages and the infant age, carried into review. */
export function encodeTravellerCounts(counts: Record<string, number>, ages: Record<string, number[]> = {}): string {
  return Object.entries(counts)
    .map(([type, quantity]) => {
      const qty = Math.max(0, Math.floor(quantity));
      const selected = (ages[type] ?? []).slice(0, qty).filter((age) => Number.isFinite(age));
      return selected.length ? `${type}:${qty}:${selected.join(".")}` : `${type}:${qty}`;
    })
    .join(",");
}

/** Ages encoded after the quantity, e.g. `CHILD:1:10` or `INFANT:1:1`. */
export function decodeTravellerAges(raw: string | null): Record<string, number[]> {
  const ages: Record<string, number[]> = {};
  if (!raw?.trim()) return ages;
  for (const part of raw.split(",")) {
    const [type, , ageList] = part.split(":");
    if (!type || !ageList) continue;
    const values = ageList
      .split(".")
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
    if (values.length) ages[type.trim().toUpperCase()] = values;
  }
  return ages;
}

/** Returns counts for every option, or null when the query has no traveller selection. */
export function decodeTravellerCounts(raw: string | null, options: TravellerOption[]): Record<string, number> | null {
  if (!raw?.trim()) return null;
  const parsed = new Map<string, number>();
  for (const part of raw.split(",")) {
    const [type, quantity] = part.split(":");
    const value = Number(quantity);
    if (!type || !Number.isFinite(value)) continue;
    parsed.set(type.trim().toUpperCase(), Math.max(0, Math.floor(value)));
  }
  if (!parsed.size) return null;
  return Object.fromEntries(
    options.map((option) => {
      const value = parsed.get(option.type);
      const quantity = value == null ? option.min : Math.min(MAX_PER_TYPE, Math.max(option.min, value));
      return [option.type, quantity];
    }),
  );
}

const TYPE_ORDER = ["ADULT", "SENIOR", "CHILD", "INFANT"];
export const DEFAULT_AGE_RANGE: Record<string, [number, number]> = {
  CHILD: [2, 17],
  INFANT: [0, 2],
};

export interface TravellerOption {
  type: TravellerType;
  label: string;
  amount: number;
  currency: string;
  minAge?: number;
  maxAge?: number;
  /** Children and infants must provide an age. */
  needsAge: boolean;
  /** At least one of these is required. */
  min: number;
}

export function travellerOptions(pkg: PackageDetail): TravellerOption[] {
  const currency = clean(pkg.pricing?.currency) ?? "LSL";
  const rows = (pkg.pricing?.prices ?? []).filter((row) => row.active !== false && clean(row.passengerType));
  const priceMap = new Map<string, (typeof rows)[0]>();
  for (const row of rows) {
    const type = row.passengerType.trim().toUpperCase();
    if (!priceMap.has(type)) {
      priceMap.set(type, row);
    }
  }

  // Always include standard categories: ADULT, CHILD, INFANT, plus any others (e.g. SENIOR)
  const allTypes = new Set<string>(["ADULT", "CHILD", "INFANT", ...priceMap.keys()]);
  const options: TravellerOption[] = [];

  for (const type of allTypes) {
    const row = priceMap.get(type);
    const isAdult = type === "ADULT";
    const isChild = type === "CHILD";
    const isInfant = type === "INFANT";

    let amount = 0;
    if (row && Number(row.amount) >= 0) {
      amount = Number(row.amount);
    } else if (isAdult && Number(pkg.pricing?.fromPrice) > 0) {
      amount = Number(pkg?.pricing?.fromPrice);
    }

    // Child age can be input up to 17 years
    const minAge = isChild ? (row?.minAge != null ? Math.min(row.minAge, 2) : 2) : isInfant ? 0 : row?.minAge ?? undefined;
    const maxAge = isChild ? 17 : isInfant ? 2 : row?.maxAge ?? undefined;

    options.push({
      type,
      label: friendlyLabel(type) ?? (isAdult ? "Adult" : isChild ? "Child" : isInfant ? "Infant" : type),
      amount,
      currency: clean(row?.currency) ?? currency,
      minAge,
      maxAge,
      needsAge: isChild || isInfant,
      min: isAdult ? 1 : 0,
    });
  }

  return options.sort((a, b) => rank(a.type) - rank(b.type));
}

export function ageChoices(option: TravellerOption): number[] {
  if (!option.needsAge) return [];
  if (option.type === "CHILD") {
    const min = option.minAge ?? 2;
    const max = 17; // Child age can be input up to 17
    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
  }
  const min = option.minAge ?? 0;
  const max = option.maxAge ?? (option.type === "INFANT" ? 2 : 17);
  if (max < min) return [];
  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
}

function rank(type: string): number {
  const index = TYPE_ORDER.indexOf(type);
  return index < 0 ? TYPE_ORDER.length : index;
}

export function optionalActivities(pkg: PackageDetail): PackageActivity[] {
  return activeActivities(pkg).filter(
    (activity) => activity.inclusionType?.toUpperCase() !== "INCLUDED" && Number(activity.price) > 0,
  );
}

export interface GuestSlot {
  key: string;
  type: TravellerType;
  label: string;
  age?: number;
  primary: boolean;
}

/** Guest names are collected for adults and children only. Infants are counted, not named. */
export function collectsGuestDetails(type: string): boolean {
  return type === "ADULT" || type === "CHILD";
}

/** One slot per adult and child, adults first; the first adult is the lead (primary) guest. */
export function guestSlots(
  options: TravellerOption[],
  counts: Record<string, number>,
  ages: Record<string, number[]>,
): GuestSlot[] {
  const slots: GuestSlot[] = [];
  for (const option of options) {
    if (!collectsGuestDetails(option.type)) continue;
    const count = counts[option.type] ?? 0;
    for (let index = 0; index < count; index += 1) {
      slots.push({
        key: `${option.type}-${index}`,
        type: option.type,
        label: `${option.label} ${index + 1}`,
        age: option.needsAge ? ages[option.type]?.[index] : undefined,
        primary: false,
      });
    }
  }
  const lead = slots.find((slot) => slot.type === "ADULT") ?? slots[0];
  if (lead) lead.primary = true;
  return slots;
}

export interface GuestForm {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
}

export function emptyGuest(type: TravellerType): GuestForm {
  return {
    title: type === "CHILD" || type === "INFANT" ? "" : "Mr",
    firstName: "",
    lastName: "",
    email: "",
    mobileCountryCode: DEFAULT_COUNTRY_CODE,
    mobileNumber: "",
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_PATTERN = /^\d{6,15}$/;
const CODE_PATTERN = /^\+\d{1,4}$/;

export type GuestErrors = Partial<Record<keyof GuestForm, string>>;

export function validateGuest(guest: GuestForm, primary: boolean, type?: string): GuestErrors {
  const errors: GuestErrors = {};

  // Child details are optional!
  if (type === "CHILD") {
    const email = guest.email.trim();
    if (email && !EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email";
    const mobile = guest.mobileNumber.replace(/\s+/g, "");
    if (mobile && !MOBILE_PATTERN.test(mobile)) errors.mobileNumber = "Enter 6–15 digits";
    return errors;
  }

  if (!guest.title) errors.title = "Select a title";
  if (!guest.firstName.trim()) errors.firstName = "First name is required";
  if (!guest.lastName.trim()) errors.lastName = "Last name is required";

  const email = guest.email.trim();
  if (primary && !email) errors.email = "Email is required";
  else if (email && !EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email";

  const mobile = guest.mobileNumber.replace(/\s+/g, "");
  if (primary && !mobile) errors.mobileNumber = "Mobile number is required";
  else if (mobile && !MOBILE_PATTERN.test(mobile)) errors.mobileNumber = "Enter 6–15 digits";

  const rawCode = guest.mobileCountryCode.trim();
  const normalizedCode = rawCode ? (rawCode.startsWith("+") ? rawCode : `+${rawCode}`) : "";
  if ((primary || mobile) && (!normalizedCode || !CODE_PATTERN.test(normalizedCode))) {
    errors.mobileCountryCode = "Invalid code (e.g. +266)";
  }
  return errors;
}

export interface PriceLine {
  key: string;
  label: string;
  quantity: number;
  unit: number;
  total: number;
}

export function priceLines(
  options: TravellerOption[],
  counts: Record<string, number>,
  activities: PackageActivity[],
  activityQty: Record<number, number>,
): PriceLine[] {
  const lines: PriceLine[] = [];
  for (const option of options) {
    const quantity = counts[option.type] ?? 0;
    if (quantity > 0) {
      lines.push({ key: option.type, label: option.label, quantity, unit: option.amount, total: option.amount * quantity });
    }
  }
  for (const activity of activities) {
    const quantity = activityQty[activity.activityId] ?? 0;
    const unit = Number(activity.price) || 0;
    if (quantity > 0) {
      lines.push({ key: `activity-${activity.activityId}`, label: activity.activityName.trim(), quantity, unit, total: unit * quantity });
    }
  }
  return lines;
}

export function buildReservationPayload(args: {
  pkg: PackageDetail;
  departureId: number;
  pickupPointId?: number;
  options: TravellerOption[];
  counts: Record<string, number>;
  ages: Record<string, number[]>;
  activityQty: Record<number, number>;
  slots: GuestSlot[];
  guests: Record<string, GuestForm>;
}): PackageReservationRequest {
  const { pkg, departureId, pickupPointId, options, counts, ages, activityQty, slots, guests } = args;

  const travellers = travellersFromCounts(options, counts, ages);

  const activities = Object.entries(activityQty)
    .filter(([, quantity]) => quantity > 0)
    .map(([activityId, quantity]) => ({ activityId: Number(activityId), quantity }));

  const lead = slots.find((slot) => slot.primary);
  const leadForm = lead ? guests[lead.key] : undefined;
  const leadCodeRaw = leadForm?.mobileCountryCode.trim() ?? DEFAULT_COUNTRY_CODE;
  const leadCode = leadCodeRaw ? (leadCodeRaw.startsWith("+") ? leadCodeRaw : `+${leadCodeRaw}`) : DEFAULT_COUNTRY_CODE;

  const guestDetails: ReservationGuest[] = slots.map((slot) => {
    const form = guests[slot.key] ?? emptyGuest(slot.type);
    const ownMobile = form.mobileNumber.replace(/\s+/g, "");
    const useLeadContact = !slot.primary && leadForm;

    const formCodeRaw = form.mobileCountryCode.trim();
    const ownCode = formCodeRaw ? (formCodeRaw.startsWith("+") ? formCodeRaw : `+${formCodeRaw}`) : DEFAULT_COUNTRY_CODE;

    const isChild = slot.type === "CHILD";
    const guest: ReservationGuest = {
      title: form.title || (isChild ? "Master" : "Mr"),
      firstName: form.firstName.trim() || (isChild ? `Child ${slot.label.split(" ")[1] || "1"}` : "Guest"),
      lastName: form.lastName.trim() || leadForm?.lastName.trim() || "Guest",
      email: form.email.trim() || (useLeadContact ? leadForm.email.trim() : ""),
      mobileCountryCode: ownMobile ? ownCode : (useLeadContact ? leadCode : ownCode),
      mobileNumber: ownMobile || (useLeadContact ? leadForm.mobileNumber.replace(/\s+/g, "") : ""),
      type: slot.type,
    };
    if (slot.primary) guest.primary = true;
    if (slot.age != null) guest.age = slot.age;
    return guest;
  });

  return {
    packageId: pkg.packageId,
    departureId,
    ...(pickupPointId != null ? { pickupPointId } : {}),
    travellers,
    activities,
    guestDetails,
  };
}
