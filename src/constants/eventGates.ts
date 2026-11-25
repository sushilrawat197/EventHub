// TODO: TEMP SPECIAL EVENT FLOW - remove this file after marathon flow is retired.
import type { MarathonRegistrationMode } from "@/features/booking/types/marathon";

/** Set to `null` to hide the Marathon Event nav tab (and related special flow). */
export const SPECIAL_EVENT_ID: number | null = null;
export const SPECIAL_EVENT_NEW_FORM_ID = 49;

/**
 * Per-event online checkout toggles — keep these independent.
 * 48: offline-first (M-Pesa/EcoCash on the form) when false.
 * 49: no offline UI; when false, registration still succeeds without payment page.
 */
export const SPECIAL_EVENT_ONLINE_PAYMENT_ENABLED = false;
export const SPECIAL_NEW_FORM_ONLINE_PAYMENT_ENABLED = true;

export const SPECIAL_MARATHON_EVENT_IDS = [
  SPECIAL_EVENT_ID,
  SPECIAL_EVENT_NEW_FORM_ID,
].filter((id): id is number => id != null);

export function isSpecialMarathonEvent(eventId: number | null | undefined): boolean {
  if (eventId == null || Number.isNaN(eventId)) return false;
  return eventId === SPECIAL_EVENT_ID || eventId === SPECIAL_EVENT_NEW_FORM_ID;
}

/** Individual-only marathon registration with a simplified form (no shoe size, medical aid). */
export function isSpecialMarathonNewFormEvent(
  eventId: number | null | undefined
): boolean {
  if (eventId == null || Number.isNaN(eventId)) return false;
  return eventId === SPECIAL_EVENT_NEW_FORM_ID;
}

export function isMarathonOnlinePaymentEnabled(
  eventId: number | null | undefined
): boolean {
  if (eventId == null || Number.isNaN(eventId)) return false;
  if (eventId === SPECIAL_EVENT_NEW_FORM_ID) return SPECIAL_NEW_FORM_ONLINE_PAYMENT_ENABLED;
  if (eventId === SPECIAL_EVENT_ID) return SPECIAL_EVENT_ONLINE_PAYMENT_ENABLED;
  return false;
}

export function defaultMarathonRegistrationMode(
  eventId?: number | null
): MarathonRegistrationMode {
  return isMarathonOnlinePaymentEnabled(eventId) ? "ONLINE" : "OFFLINE";
}

/** Forces OFFLINE when that event's online payment is disabled; otherwise keeps the chosen mode. */
export function normalizeMarathonRegistrationMode(
  mode: MarathonRegistrationMode | undefined | null,
  eventId?: number | null
): MarathonRegistrationMode {
  if (!isMarathonOnlinePaymentEnabled(eventId)) return "OFFLINE";
  return mode ?? defaultMarathonRegistrationMode(eventId);
}

export function isOfflineMarathonIndividual(
  participantType: "INDIVIDUAL" | "CORPORATE" | undefined,
  registrationMode: MarathonRegistrationMode | undefined | null,
  isSpecialNewForm: boolean,
  eventId?: number | null
): boolean {
  if (isSpecialNewForm) return false;
  if ((participantType ?? "INDIVIDUAL") !== "INDIVIDUAL") return false;
  return normalizeMarathonRegistrationMode(registrationMode, eventId) === "OFFLINE";
}

/** Persists marathon ticket + participant choice across login for special event (individual). */
export const SPECIAL_MARATHON_REGISTRATION_STASH_KEY = "eventhub:specialMarathonRegistration";

/** Fixed corporate option for SPECIAL_EVENT_NEW_FORM_ID — no API fetch needed. */
export const SPECIAL_NEW_FORM_CORPORATE = {
  corporateId: 80,
  corporateName: "Lesotho Defense Force (LDF)",
} as const;
