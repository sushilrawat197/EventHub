import type { MarathonOfflinePaymentTypeCode, MarathonRegistrationMode } from "@/features/booking/types/marathon";
import type { CategorySelection } from "@/features/booking/services/booking.service";

export type MarathonGender = "" | "Male" | "Female" | "Other";

export type MarathonRaceCategory =
  | ""
  | "5km"
  | "10km"
  | "21km"
  | "42km"
  | "Kids 5km"
  | "Adults 5km"
  | "Adults 10km"
  | "Adults 21km";

export interface ParticipantFormData {
  participantType: "CORPORATE" | "INDIVIDUAL";
  corporateId: number | null;
  gender: MarathonGender;
  raceCategory: MarathonRaceCategory;
  name: string;
  surname: string;
  dateOfBirth: string;
  identityType: "id" | "passport";
  identityValue: string;
  email: string;
  cellNumber: string;
  medicalCondition: "" | "YES" | "NO";
  medicalConditionDetails: string;
  district: string;
  runningClub: string;
  medicalAidName: string;
  medicalAidNumber: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "";
  shoeSize: string;
  disclaimerAccepted: boolean;
  paymentType: MarathonOfflinePaymentTypeCode | "";
}

export type ParticipantFormErrors = Partial<Record<keyof ParticipantFormData, string>>;

export const INITIAL_FORM: ParticipantFormData = {
  participantType: "INDIVIDUAL",
  corporateId: null,
  gender: "",
  raceCategory: "",
  name: "",
  surname: "",
  dateOfBirth: "",
  identityType: "id",
  identityValue: "",
  email: "",
  cellNumber: "",
  medicalCondition: "",
  medicalConditionDetails: "",
  district: "",
  runningClub: "",
  medicalAidName: "",
  medicalAidNumber: "",
  emergencyContactName: "",
  emergencyNumber: "",
  shirtSize: "",
  shoeSize: "",
  disclaimerAccepted: false,
  paymentType: "",
};

export type MarathonLocationState = {
  categories?: CategorySelection[];
  marathonCorporateSuccess?: boolean;
  marathonRegistrationSuccess?: boolean;
  marathonRegistrationParticipantType?: "INDIVIDUAL" | "CORPORATE";
  participantType?: "INDIVIDUAL" | "CORPORATE";
  registrationMode?: MarathonRegistrationMode;
};

export const SHIRT_SIZE_OPTIONS: Exclude<ParticipantFormData["shirtSize"], "">[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

export const PARTICIPANT_TYPE_LABEL: Record<ParticipantFormData["participantType"], string> = {
  INDIVIDUAL: "Individual",
  CORPORATE: "Corporate",
};

export const IDENTITY_TYPE_LABEL: Record<ParticipantFormData["identityType"], string> = {
  id: "LS Citizen ID",
  passport: "Passport",
};

export const MEDICAL_CONDITION_LABEL: Record<
  Exclude<ParticipantFormData["medicalCondition"], "">,
  string
> = {
  YES: "Yes",
  NO: "No",
};

export const GENDER_OPTIONS: Exclude<MarathonGender, "">[] = ["Male", "Female", "Other"];

export const RACE_CATEGORY_OPTIONS: Exclude<MarathonRaceCategory, "">[] = [
  "5km",
  "10km",
  "21km",
  "42km",
];

export const RACE_CATEGORY_NEW_FORM_OPTIONS: Exclude<MarathonRaceCategory, "">[] = [
  "Kids 5km",
  "Adults 5km",
  "Adults 10km",
  "Adults 21km",
];
