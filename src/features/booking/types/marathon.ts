// TODO: TEMP EVENT-39 FLOW - remove after marathon registration flow is retired.

/** Individual registration channel chosen on ticket selection. */
export type MarathonRegistrationMode = "ONLINE" | "OFFLINE";

/** Offline mobile-money options (code → label). */
export const MARATHON_OFFLINE_PAYMENT_TYPES = [
  { code: "19773", key: "VODACOM", label: "Vodacom" },
  { code: "92236", key: "ECO_CASH", label: "Eco Cash" },
] as const;

export type MarathonOfflinePaymentTypeCode =
  (typeof MARATHON_OFFLINE_PAYMENT_TYPES)[number]["code"];

export interface MarathonRegistrationPayload {
  participantType: "CORPORATE" | "INDIVIDUAL";
  corporateId: number | null;
  ticketCategoryId: number;
  noOfTicket: number;
  eventId: number;
  gender: string;
  raceCategory: string;
  name: string;
  surname: string;
  identityType: "LS_CITIZEN" | "FOREIGN_NATIONAL";
  idNumber: string | null;
  passportNumber: string | null;
  emailAddress: string;
  cellNumber: string;
  district: string;
  dateOfBirth: string;
  medicalCondition: "YES" | "NO";
  medicalConditionDetails: string | null;
  runningClub: string;
  medicalAidName: string;
  medicalAidNumber: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  shoeSize?: string;
  disclaimerAccepted: boolean;
  /** Required for individual OFFLINE registration (Vodacom / Eco Cash code). */
  paymentType?: MarathonOfflinePaymentTypeCode;
}

export interface MarathonRegistrationDetails {
  registrationId?: number;
  bookingStatus?: string;
  userId: number;
  participantType?: "CORPORATE" | "INDIVIDUAL";
  corporateId?: number | null;
  ticketCategoryId?: number;
  noOfTicket?: number;
  eventId?: number;
  gender?: string;
  raceCategory?: string;
  name: string;
  surname: string;
  identityType: "LS_CITIZEN" | "FOREIGN_NATIONAL";
  idNumber: string | null;
  passportNumber: string | null;
  emailAddress: string;
  cellNumber: string;
  district: string;
  dateOfBirth?: string;
  medicalCondition?: "FIT" | "UNFIT" | "YES" | "NO";
  medicalConditionDetails?: string | null;
  runningClub?: string;
  medicalAidName?: string;
  medicalAidNumber?: string;
  emergencyContactName?: string;
  emergencyNumber?: string;
  shirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  tShirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  tshirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  shoeSize?: string;
  disclaimerAccepted: boolean;
  createdAt?: string;
}

export interface ActiveCorporate {
  corporateId: number;
  corporateName: string;
}

export const MARATHON_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidMarathonEmail(email: string): boolean {
  return MARATHON_EMAIL_PATTERN.test(email.trim());
}

export function normalizeMarathonEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function marathonEmailCheckCacheKey(eventId: number, email: string): string {
  return `${eventId}:${normalizeMarathonEmail(email)}`;
}

export type MarathonRegistrationStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | string;

export type MarathonBookingStatus = "NOT_BOOKED" | "CONFIRMED" | "PENDING" | string;

export interface MarathonEmailRegistrationCheckData {
  registered: boolean;
  bookingDone: boolean;
  registrationStatus: MarathonRegistrationStatus;
  bookingStatus: MarathonBookingStatus;
  registrationId?: number;
  bookingId?: number;
}

export type MarathonEmailCheckOutcome =
  | { type: "available" }
  | { type: "confirmed_blocked"; message: string }
  | {
      type: "pending_payment";
      message: string;
      registrationId?: number;
      bookingId?: number;
    }
  | { type: "already_registered"; message: string };

export const MARATHON_DISTRICT_OPTIONS = [
  "Berea",
  "Butha-Buthe",
  "Leribe",
  "Mafeteng",
  "Maseru",
  "Mohale's Hoek",
  "Mokhotlong",
  "Qacha's Nek",
  "Quthing",
  "Thaba-Tseka",
] as const;

function normalizeMarathonStatus(value: string | undefined): string {
  return (value ?? "").trim().toUpperCase();
}

export function resolveMarathonEmailCheckOutcome(
  data: MarathonEmailRegistrationCheckData
): MarathonEmailCheckOutcome {
  const registrationStatus = normalizeMarathonStatus(data.registrationStatus);
  const bookingStatus = normalizeMarathonStatus(data.bookingStatus);
  const isApproved = registrationStatus === "APPROVED";
  const isRegistered = data.registered || isApproved;
  const isBookingConfirmed = data.bookingDone || bookingStatus === "CONFIRMED";

  if (isRegistered && isBookingConfirmed) {
    return {
      type: "confirmed_blocked",
      message: "This email is already registered and booking is confirmed.",
    };
  }

  if (isApproved) {
    if (
      bookingStatus === "PENDING" ||
      (isRegistered && !isBookingConfirmed && data.bookingDone === false)
    ) {
      return {
        type: "pending_payment",
        message: "Registration already exists but booking/payment is still pending.",
        registrationId: data.registrationId,
        bookingId: data.bookingId,
      };
    }

    return {
      type: "already_registered",
      message: "Registration already exists for this email.",
    };
  }

  if (isRegistered && !isBookingConfirmed) {
    return {
      type: "pending_payment",
      message: "Registration already exists but booking/payment is still pending.",
      registrationId: data.registrationId,
      bookingId: data.bookingId,
    };
  }

  return { type: "available" };
}
