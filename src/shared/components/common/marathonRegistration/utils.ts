import type { MarathonRegistrationDetails } from "@/features/booking/types/marathon";
import {
  RACE_CATEGORY_NEW_FORM_OPTIONS,
  RACE_CATEGORY_OPTIONS,
  type MarathonGender,
  type MarathonRaceCategory,
  type ParticipantFormData,
} from "./types";

export function isMarathonRaceCategory(
  value: string,
  newForm = false
): value is Exclude<MarathonRaceCategory, ""> {
  const options = newForm ? RACE_CATEGORY_NEW_FORM_OPTIONS : RACE_CATEGORY_OPTIONS;
  return (options as string[]).includes(value);
}

/** API expects MALE | FEMALE | OTHER; form UI uses title case. */
export function marathonGenderFromApi(raw: string | undefined): MarathonGender {
  const key = (raw ?? "").trim().toLowerCase();
  if (key === "male") return "Male";
  if (key === "female") return "Female";
  if (key === "other") return "Other";
  return "";
}

export function parseIsoDateLocal(iso: string): Date | undefined {
  if (!iso.trim()) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDobDisplay(iso: string): string {
  const d = parseIsoDateLocal(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function normalizePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("266")) return `+${digits}`;
  if (digits.length === 8) return `+266${digits}`;
  return value.trim();
}

export function mapRegistrationDetailsToForm(
  registrationData: MarathonRegistrationDetails,
  isSpecialNewForm: boolean
): ParticipantFormData {
  const apiRaceCategory = registrationData.raceCategory ?? "";

  return {
    participantType: registrationData.participantType === "CORPORATE" ? "CORPORATE" : "INDIVIDUAL",
    corporateId: registrationData.corporateId ?? null,
    gender: marathonGenderFromApi(registrationData.gender),
    raceCategory: isMarathonRaceCategory(apiRaceCategory, isSpecialNewForm) ? apiRaceCategory : "",
    name: registrationData.name || "",
    surname: registrationData.surname || "",
    dateOfBirth: registrationData.dateOfBirth || "",
    identityType: registrationData.identityType === "LS_CITIZEN" ? "id" : "passport",
    identityValue:
      registrationData.identityType === "LS_CITIZEN"
        ? registrationData.idNumber || ""
        : registrationData.passportNumber || "",
    email: registrationData.emailAddress || "",
    cellNumber: registrationData.cellNumber || "",
    medicalCondition:
      registrationData.medicalCondition === "YES" || registrationData.medicalCondition === "UNFIT"
        ? "YES"
        : registrationData.medicalCondition === "NO" || registrationData.medicalCondition === "FIT"
          ? "NO"
          : "",
    medicalConditionDetails: registrationData.medicalConditionDetails || "",
    district: registrationData.district || "",
    runningClub: registrationData.runningClub || "",
    medicalAidName: registrationData.medicalAidName || "",
    medicalAidNumber: registrationData.medicalAidNumber || "",
    emergencyContactName: registrationData.emergencyContactName || "",
    emergencyNumber: registrationData.emergencyNumber || "",
    shirtSize:
      registrationData.shirtSize ||
      registrationData.tShirtSize ||
      registrationData.tshirtSize ||
      "",
    shoeSize: registrationData.shoeSize || "",
    disclaimerAccepted: !!registrationData.disclaimerAccepted,
    paymentType: "",
  };
}
