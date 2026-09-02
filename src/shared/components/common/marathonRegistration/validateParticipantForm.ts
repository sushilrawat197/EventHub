import {
  MARATHON_NEW_FORM_TERMS_ACCEPTANCE_LABEL,
} from "@/constants/marathonRegistrationPolicy";
import { MARATHON_TERMS_ACCEPTANCE_LABEL } from "../MarathonRegistrationTermsSection";
import { parseIsoDateLocal } from "./utils";
import type { ParticipantFormData, ParticipantFormErrors } from "./types";

interface ValidateParticipantFormOptions {
  isSpecialNewForm: boolean;
  isOfflineIndividual: boolean;
}

export function validateParticipantForm(
  data: ParticipantFormData,
  { isSpecialNewForm, isOfflineIndividual }: ValidateParticipantFormOptions
): ParticipantFormErrors {
  const errors: ParticipantFormErrors = {};
  const nameRegex = /^[A-Za-z\s'-]{2,}$/;
  const lsPhoneRegex = /^\d{8,10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const idRegex = /^\d{6,20}$/;
  const passportRegex = /^[A-Za-z0-9]{6,20}$/;

  if (!data.name.trim()) errors.name = "Name is required.";
  else if (!nameRegex.test(data.name.trim())) errors.name = "Enter a valid name.";

  if (!data.surname.trim()) errors.surname = "Surname is required.";
  else if (!nameRegex.test(data.surname.trim())) errors.surname = "Enter a valid surname.";

  if (!data.dateOfBirth.trim()) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const dob = parseIsoDateLocal(data.dateOfBirth);
    if (!dob) {
      errors.dateOfBirth = "Invalid date of birth.";
    } else {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (dob > today) {
        errors.dateOfBirth = "Date cannot be in the future.";
      } else {
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
        if (age < 16) errors.dateOfBirth = "Participant must be at least 16 years old.";
        if (age > 120) errors.dateOfBirth = "Enter a valid date of birth.";
      }
    }
  }

  if (data.participantType === "CORPORATE" && !data.corporateId) {
    errors.corporateId = "Please select a corporate.";
  }

  if (isOfflineIndividual && !data.paymentType) {
    errors.paymentType = "Please select a payment type.";
  }

  if (!data.gender) errors.gender = "Please select gender.";
  if (!data.raceCategory) errors.raceCategory = "Please select a race category.";

  if (!data.identityValue.trim()) {
    errors.identityValue =
      data.identityType === "id" ? "ID number is required." : "Passport number is required.";
  } else if (data.identityType === "id" && !idRegex.test(data.identityValue.trim())) {
    errors.identityValue = "ID number must be 6-20 digits.";
  } else if (data.identityType === "passport" && !passportRegex.test(data.identityValue.trim())) {
    errors.identityValue = "Passport number must be 6-20 letters or digits.";
  }

  if (!data.email.trim()) errors.email = "Email address is required.";
  else if (!emailRegex.test(data.email.trim())) errors.email = "Enter a valid email address.";

  if (!data.cellNumber.trim()) errors.cellNumber = "Cell number is required.";
  else if (!lsPhoneRegex.test(data.cellNumber.trim())) {
    errors.cellNumber = "Cell number must be 8-10 digits.";
  }

  if (!data.medicalCondition) {
    errors.medicalCondition = "Please select Yes or No.";
  } else if (data.medicalCondition === "YES" && !data.medicalConditionDetails.trim()) {
    errors.medicalConditionDetails = "Please specify the medical condition.";
  }

  if (!data.district.trim()) errors.district = "Please select a district.";

  if (!isSpecialNewForm && data.medicalAidName.trim() && !nameRegex.test(data.medicalAidName.trim())) {
    errors.medicalAidName = "Enter a valid name.";
  }

  if (!isSpecialNewForm && data.medicalAidNumber.trim() && !lsPhoneRegex.test(data.medicalAidNumber.trim())) {
    errors.medicalAidNumber = "Must be 8-10 digits.";
  }

  if (!data.emergencyContactName.trim()) {
    errors.emergencyContactName = "Emergency contact name is required.";
  } else if (!nameRegex.test(data.emergencyContactName.trim())) {
    errors.emergencyContactName = "Enter a valid name.";
  }

  if (!data.emergencyNumber.trim()) {
    errors.emergencyNumber = "Emergency contact number is required.";
  } else if (!lsPhoneRegex.test(data.emergencyNumber.trim())) {
    errors.emergencyNumber = "Must be 8-10 digits.";
  }

  if (!data.shirtSize) errors.shirtSize = "Please select a T-shirt size.";
  if (!isSpecialNewForm && !data.shoeSize) errors.shoeSize = "Please select a shoe size.";
  if (!data.disclaimerAccepted) {
    errors.disclaimerAccepted = isSpecialNewForm
      ? MARATHON_NEW_FORM_TERMS_ACCEPTANCE_LABEL
      : MARATHON_TERMS_ACCEPTANCE_LABEL;
  }

  return errors;
}
