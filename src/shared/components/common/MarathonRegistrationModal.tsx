// TODO: TEMP EVENT-39 FLOW - remove this component once marathon registration flow is retired.
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import {
  submitMarathonRegistration,
  type MarathonRegistrationDetails,
  type MarathonRegistrationPayload,
} from "../../../features/booking/api/marathonRegistration";

interface ParticipantFormData {
  name: string;
  surname: string;
  identityType: "id" | "passport";
  identityValue: string;
  email: string;
  cellNumber: string;
  district: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "";
  disclaimerAccepted: boolean;
}

type ParticipantFormErrors = Partial<Record<keyof ParticipantFormData, string>>;

interface MarathonRegistrationModalProps {
  isOpen: boolean;
  userId?: number | null;
  registrationData?: MarathonRegistrationDetails | null;
  isRegistrationLoading?: boolean;
  readOnlyWhenExisting?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const INITIAL_FORM: ParticipantFormData = {
  name: "",
  surname: "",
  identityType: "id",
  identityValue: "",
  email: "",
  cellNumber: "",
  district: "",
  emergencyContactName: "",
  emergencyNumber: "",
  shirtSize: "",
  disclaimerAccepted: false,
};

export default function MarathonRegistrationModal({
  isOpen,
  userId,
  registrationData = null,
  isRegistrationLoading = false,
  readOnlyWhenExisting = true,
  onClose,
  onSuccess,
}: MarathonRegistrationModalProps) {
  const [participantForm, setParticipantForm] =
    useState<ParticipantFormData>(INITIAL_FORM);
  const [participantErrors, setParticipantErrors] =
    useState<ParticipantFormErrors>({});
  const [submittingParticipant, setSubmittingParticipant] = useState(false);
  const isExistingRegistration = registrationData !== null;

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setParticipantErrors({});
    if (!registrationData) {
      setParticipantForm(INITIAL_FORM);
      return;
    }
    setParticipantForm({
      name: registrationData.name || "",
      surname: registrationData.surname || "",
      identityType:
        registrationData.identityType === "LS_CITIZEN" ? "id" : "passport",
      identityValue:
        registrationData.identityType === "LS_CITIZEN"
          ? registrationData.idNumber || ""
          : registrationData.passportNumber || "",
      email: registrationData.emailAddress || "",
      cellNumber: registrationData.cellNumber || "",
      district: registrationData.district || "",
      emergencyContactName: registrationData.emergencyContactName || "",
      emergencyNumber: registrationData.emergencyNumber || "",
      shirtSize: registrationData.shirtSize || registrationData.tShirtSize || "",
      disclaimerAccepted: !!registrationData.disclaimerAccepted,
    });
  }, [isOpen, registrationData]);

  const handleParticipantChange = (
    key: keyof ParticipantFormData,
    value: string | boolean
  ) => {
    setParticipantForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setParticipantErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  };

  const validateParticipantForm = (data: ParticipantFormData) => {
    const errors: ParticipantFormErrors = {};
    const nameRegex = /^[A-Za-z\s'-]{2,}$/;
    const lsPhoneRegex = /^\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idRegex = /^\d{6,20}$/;
    const passportRegex = /^[A-Za-z0-9]{6,20}$/;

    if (!data.name.trim()) errors.name = "Name is required.";
    else if (!nameRegex.test(data.name.trim()))
      errors.name = "Enter a valid name.";
    if (!data.surname.trim()) errors.surname = "Surname is required.";
    else if (!nameRegex.test(data.surname.trim()))
      errors.surname = "Enter a valid surname.";

    if (!data.identityValue.trim()) {
      errors.identityValue =
        data.identityType === "id"
          ? "ID number is required."
          : "Passport number is required.";
    } else if (
      data.identityType === "id" &&
      !idRegex.test(data.identityValue.trim())
    ) {
      errors.identityValue = "ID number must be 6-20 digits.";
    } else if (
      data.identityType === "passport" &&
      !passportRegex.test(data.identityValue.trim())
    ) {
      errors.identityValue = "Passport number must be 6-20 letters or digits.";
    }

    if (!data.email.trim()) errors.email = "Email address is required.";
    else if (!emailRegex.test(data.email.trim()))
      errors.email = "Enter a valid email address.";
    if (!data.cellNumber.trim()) errors.cellNumber = "Cell number is required.";
    else if (!lsPhoneRegex.test(data.cellNumber.trim()))
      errors.cellNumber = "Cell number must be 8 digits.";
    if (!data.district.trim()) errors.district = "District is required.";

    if (!data.emergencyContactName.trim()) {
      errors.emergencyContactName = "Emergency contact name is required.";
    } else if (!nameRegex.test(data.emergencyContactName.trim())) {
      errors.emergencyContactName = "Enter a valid emergency contact name.";
    }

    if (!data.emergencyNumber.trim()) {
      errors.emergencyNumber = "Emergency number is required.";
    } else if (!lsPhoneRegex.test(data.emergencyNumber.trim())) {
      errors.emergencyNumber = "Emergency number must be 8 digits.";
    }

    if (!data.shirtSize) errors.shirtSize = "Please select a T-shirt size.";
    if (!data.disclaimerAccepted) {
      errors.disclaimerAccepted = "You must accept the disclaimer.";
    }
    return errors;
  };

  const handleParticipantSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateParticipantForm(participantForm);
    setParticipantErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!userId) return;

    const normalizePhoneNumber = (value: string) => {
      const digits = value.replace(/\D/g, "");
      if (digits.startsWith("266")) return `+${digits}`;
      if (digits.length === 8) return `+266${digits}`;
      return value.trim();
    };

    const registrationPayload: MarathonRegistrationPayload = {
      userId: Number(userId),
      name: participantForm.name.trim(),
      surname: participantForm.surname.trim(),
      identityType:
        participantForm.identityType === "id" ? "LS_CITIZEN" : "FOREIGN_NATIONAL",
      idNumber:
        participantForm.identityType === "id"
          ? participantForm.identityValue.trim()
          : null,
      passportNumber:
        participantForm.identityType === "passport"
          ? participantForm.identityValue.trim()
          : null,
      emailAddress: participantForm.email.trim(),
      cellNumber: normalizePhoneNumber(participantForm.cellNumber),
      district: participantForm.district.trim(),
      emergencyContactName: participantForm.emergencyContactName.trim(),
      emergencyNumber: normalizePhoneNumber(participantForm.emergencyNumber),
      shirtSize: participantForm.shirtSize as
        | "XS"
        | "S"
        | "M"
        | "L"
        | "XL"
        | "XXL",
      disclaimerAccepted: participantForm.disclaimerAccepted,
    };

    setSubmittingParticipant(true);
    const result = await submitMarathonRegistration(registrationPayload);
    setSubmittingParticipant(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Registration submitted successfully.");
    setParticipantForm(INITIAL_FORM);
    setParticipantErrors({});
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Participant Information</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleParticipantSubmit} className="p-6 space-y-4">
          {isExistingRegistration && readOnlyWhenExisting && (
            <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2">
              Registration already exists. Showing saved details.
            </div>
          )}
          {isRegistrationLoading ? (
            <div className="py-8 flex items-center justify-center text-gray-600">
              Loading registration details...
            </div>
          ) : (
            <fieldset
              disabled={isExistingRegistration && readOnlyWhenExisting}
              className={
                isExistingRegistration && readOnlyWhenExisting ? "opacity-80" : ""
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={participantForm.name} onChange={(e) => handleParticipantChange("name", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.name && <p className="mt-1 text-xs text-red-600">{participantErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                  <input type="text" value={participantForm.surname} onChange={(e) => handleParticipantChange("surname", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.surname ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.surname && <p className="mt-1 text-xs text-red-600">{participantErrors.surname}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Identity Type</label>
                  <select value={participantForm.identityType} onChange={(e) => handleParticipantChange("identityType", e.target.value as "id" | "passport")} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="id">ID Number (LS Citizens)</option>
                    <option value="passport">Passport Number (Foreign Nationals)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{participantForm.identityType === "id" ? "ID Number" : "Passport Number"}</label>
                  <input type="text" value={participantForm.identityValue} onChange={(e) => handleParticipantChange("identityValue", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.identityValue ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.identityValue && <p className="mt-1 text-xs text-red-600">{participantErrors.identityValue}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" value={participantForm.email} onChange={(e) => handleParticipantChange("email", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.email && <p className="mt-1 text-xs text-red-600">{participantErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cell Number</label>
                  <input type="tel" value={participantForm.cellNumber} onChange={(e) => handleParticipantChange("cellNumber", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.cellNumber ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.cellNumber && <p className="mt-1 text-xs text-red-600">{participantErrors.cellNumber}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input type="text" value={participantForm.district} onChange={(e) => handleParticipantChange("district", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.district ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.district && <p className="mt-1 text-xs text-red-600">{participantErrors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">T-shirt Size</label>
                  <select value={participantForm.shirtSize} onChange={(e) => handleParticipantChange("shirtSize", e.target.value as ParticipantFormData["shirtSize"])} className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 ${participantErrors.shirtSize ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}>
                    <option value="">T-shirt Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  {participantErrors.shirtSize && <p className="mt-1 text-xs text-red-600">{participantErrors.shirtSize}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input type="text" value={participantForm.emergencyContactName} onChange={(e) => handleParticipantChange("emergencyContactName", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.emergencyContactName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.emergencyContactName && <p className="mt-1 text-xs text-red-600">{participantErrors.emergencyContactName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Number</label>
                  <input type="tel" value={participantForm.emergencyNumber} onChange={(e) => handleParticipantChange("emergencyNumber", e.target.value)} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${participantErrors.emergencyNumber ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`} />
                  {participantErrors.emergencyNumber && <p className="mt-1 text-xs text-red-600">{participantErrors.emergencyNumber}</p>}
                </div>
              </div>
              <label className="flex items-start gap-3 text-sm text-gray-700 mt-4">
                <input type="checkbox" checked={participantForm.disclaimerAccepted} onChange={(e) => handleParticipantChange("disclaimerAccepted", e.target.checked)} className="mt-1" />
                <span className="text-red-500 font-semibold">I warrant that I am physically fit and sufficiently trained to participate.</span>
              </label>
              {participantErrors.disclaimerAccepted && <p className="text-xs text-red-600 -mt-3">{participantErrors.disclaimerAccepted}</p>}
              {(!isExistingRegistration || !readOnlyWhenExisting) && (
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!participantForm.disclaimerAccepted || submittingParticipant}
                    className={`w-full text-white font-semibold py-2.5 rounded-lg transition-colors ${
                      participantForm.disclaimerAccepted && !submittingParticipant
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {submittingParticipant ? "Submitting..." : "Submit"}
                  </button>
                </div>
              )}
            </fieldset>
          )}
        </form>
      </div>
    </div>
  );
}

