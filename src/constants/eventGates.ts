// TODO: TEMP SPECIAL EVENT FLOW - remove this file after marathon flow is retired.
export const SPECIAL_EVENT_ID = 48;

export const SPECIAL_EVENT_NEW_FORM_ID = 49;

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

/** Persists marathon ticket + participant choice across login for special event (individual). */
export const SPECIAL_MARATHON_REGISTRATION_STASH_KEY = "eventhub:specialMarathonRegistration";
