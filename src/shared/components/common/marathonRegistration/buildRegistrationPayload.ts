import { MARATHON_ONLINE_PAYMENT_ENABLED } from "@/constants/eventGates";
import type { MarathonRegistrationPayload } from "@/features/booking/types/marathon";
import { normalizePhoneNumber } from "./utils";
import type { ParticipantFormData } from "./types";

interface BuildRegistrationPayloadOptions {
  participantForm: ParticipantFormData;
  isSpecialNewForm: boolean;
  isOfflineIndividual: boolean;
  resolvedEventId: number;
  resolvedTicketCategoryId: number;
  resolvedNoOfTicket: number;
}

export function buildRegistrationPayload({
  participantForm,
  isSpecialNewForm,
  isOfflineIndividual,
  resolvedEventId,
  resolvedTicketCategoryId,
  resolvedNoOfTicket,
}: BuildRegistrationPayloadOptions): MarathonRegistrationPayload {
  const treatsAsOfflineIndividual =
    isOfflineIndividual ||
    (!MARATHON_ONLINE_PAYMENT_ENABLED &&
      !isSpecialNewForm &&
      participantForm.participantType === "INDIVIDUAL");

  const resolvedParticipantType: MarathonRegistrationPayload["participantType"] =
    isSpecialNewForm
      ? participantForm.participantType
      : treatsAsOfflineIndividual
        ? "INDIVIDUAL_OFFLINE"
        : participantForm.participantType;

  return {
    participantType: resolvedParticipantType,
    corporateId:
      participantForm.participantType === "CORPORATE" ? participantForm.corporateId : null,
    ticketCategoryId: Number(resolvedTicketCategoryId),
    noOfTicket: Number(resolvedNoOfTicket),
    eventId: Number(resolvedEventId),
    gender: participantForm.gender.toUpperCase(),
    raceCategory: participantForm.raceCategory,
    name: participantForm.name.trim(),
    surname: participantForm.surname.trim(),
    identityType: participantForm.identityType === "id" ? "LS_CITIZEN" : "FOREIGN_NATIONAL",
    idNumber: participantForm.identityType === "id" ? participantForm.identityValue.trim() : null,
    passportNumber:
      participantForm.identityType === "passport" ? participantForm.identityValue.trim() : null,
    emailAddress: participantForm.email.trim(),
    cellNumber: normalizePhoneNumber(participantForm.cellNumber),
    district: participantForm.district.trim(),
    dateOfBirth: participantForm.dateOfBirth.trim(),
    medicalCondition: participantForm.medicalCondition as "YES" | "NO",
    medicalConditionDetails:
      participantForm.medicalCondition === "YES"
        ? participantForm.medicalConditionDetails.trim()
        : null,
    runningClub: participantForm.runningClub.trim(),
    medicalAidName: isSpecialNewForm ? "" : participantForm.medicalAidName.trim(),
    medicalAidNumber: isSpecialNewForm
      ? ""
      : participantForm.medicalAidNumber.trim()
        ? normalizePhoneNumber(participantForm.medicalAidNumber)
        : "",
    emergencyContactName: participantForm.emergencyContactName.trim(),
    emergencyNumber: normalizePhoneNumber(participantForm.emergencyNumber),
    shirtSize: participantForm.shirtSize as "XS" | "S" | "M" | "L" | "XL" | "XXL",
    ...(isSpecialNewForm ? {} : { shoeSize: participantForm.shoeSize.trim() }),
    disclaimerAccepted: participantForm.disclaimerAccepted,
    ...(treatsAsOfflineIndividual && participantForm.paymentType
      ? { paymentType: participantForm.paymentType }
      : {}),
  };
}

export function shouldSkipOnlineCheckout(
  participantForm: ParticipantFormData,
  isSpecialNewForm: boolean,
  isOfflineIndividual: boolean
): boolean {
  const treatsAsOfflineIndividual =
    isOfflineIndividual ||
    (!MARATHON_ONLINE_PAYMENT_ENABLED &&
      !isSpecialNewForm &&
      participantForm.participantType === "INDIVIDUAL");

  return participantForm.participantType === "CORPORATE" || treatsAsOfflineIndividual;
}

export function treatsAsOfflineIndividual(
  participantForm: ParticipantFormData,
  isSpecialNewForm: boolean,
  isOfflineIndividual: boolean
): boolean {
  return (
    isOfflineIndividual ||
    (!MARATHON_ONLINE_PAYMENT_ENABLED &&
      !isSpecialNewForm &&
      participantForm.participantType === "INDIVIDUAL")
  );
}
