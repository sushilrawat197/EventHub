import type { StoredPackageReservation } from "../types/packageReservation";

const key = (bookingId: number | string) => `eventhub:package-reservation:${bookingId}`;

export function saveReservation(entry: StoredPackageReservation): void {
  try {
    sessionStorage.setItem(key(entry.reservation.bookingId), JSON.stringify(entry));
  } catch {
    // Storage can be unavailable (private mode / quota); the page still works from router state.
  }
}

export function loadReservation(bookingId: number | string): StoredPackageReservation | null {
  try {
    const raw = sessionStorage.getItem(key(bookingId));
    return raw ? (JSON.parse(raw) as StoredPackageReservation) : null;
  } catch {
    return null;
  }
}

export function clearReservation(bookingId: number | string): void {
  try {
    sessionStorage.removeItem(key(bookingId));
  } catch {
    // ignore
  }
}

/** Milliseconds left until `expiresAt`, or undefined when there is no expiry. */
export function msUntil(expiresAt: string | null | undefined, now = Date.now()): number | undefined {
  if (!expiresAt) return undefined;
  const time = new Date(expiresAt).getTime();
  return Number.isNaN(time) ? undefined : time - now;
}
