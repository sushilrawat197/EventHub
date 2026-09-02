// TODO: TEMP SPECIAL EVENT FLOW - remove this file after marathon flow is retired.
import type { MarathonRegistrationMode } from "@/features/booking/types/marathon";

export const SPECIAL_EVENT_ID = 48;
export const SPECIAL_EVENT_NEW_FORM_ID = 49;

/** Flip to `true` to show Online on ticket selection and allow online checkout for individuals. */
export const MARATHON_ONLINE_PAYMENT_ENABLED = false;

export const SPECIAL_MARATHON_EVENT_IDS = [
  SPECIAL_EVENT_ID,
  SPECIAL_EVENT_NEW_FORM_ID,
] as const;

export function isSpecialMarathonEvent(eventId: number | null | undefined): boolean {
  if (eventId == null || Number.isNaN(eventId)) return false;
  return (
    eventId === SPECIAL_EVENT_ID || eventId === SPECIAL_EVENT_NEW_FORM_ID
  );
}

/** Individual-only marathon registration with a simplified form (no race category, shoe size, medical aid). */
export function isSpecialMarathonNewFormEvent(
  eventId: number | null | undefined
): boolean {
  if (eventId == null || Number.isNaN(eventId)) return false;
  return eventId === SPECIAL_EVENT_NEW_FORM_ID;
}

export function defaultMarathonRegistrationMode(): MarathonRegistrationMode {
  return MARATHON_ONLINE_PAYMENT_ENABLED ? "ONLINE" : "OFFLINE";
}

/** Forces OFFLINE when online payment is disabled; otherwise keeps the chosen mode. */
export function normalizeMarathonRegistrationMode(
  mode: MarathonRegistrationMode | undefined | null
): MarathonRegistrationMode {
  if (!MARATHON_ONLINE_PAYMENT_ENABLED) return "OFFLINE";
  return mode ?? defaultMarathonRegistrationMode();
}

export function isOfflineMarathonIndividual(
  participantType: "INDIVIDUAL" | "CORPORATE" | undefined,
  registrationMode: MarathonRegistrationMode | undefined | null,
  isSpecialNewForm: boolean
): boolean {
  if (isSpecialNewForm) return false;
  if ((participantType ?? "INDIVIDUAL") !== "INDIVIDUAL") return false;
  return normalizeMarathonRegistrationMode(registrationMode) === "OFFLINE";
}

/** Persists marathon ticket + participant choice across login for special event (individual). */
export const SPECIAL_MARATHON_REGISTRATION_STASH_KEY = "eventhub:specialMarathonRegistration";

/** Fixed corporate option for SPECIAL_EVENT_NEW_FORM_ID — no API fetch needed. */
export const SPECIAL_NEW_FORM_CORPORATE = {
  corporateId: 80,
  corporateName: "Lesotho Defense Force (LDF)",
} as const;
