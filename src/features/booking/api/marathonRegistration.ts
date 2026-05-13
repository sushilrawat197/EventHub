// TODO: TEMP EVENT-39 FLOW - remove this API module after marathon registration flow is retired.
import axios from "axios";
import { apiConnector } from "../../../services/apiConnector";

const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

export interface MarathonRegistrationPayload {
  participantType: "CORPORATE" | "INDIVIDUAL";
  corporateId: number | null;
  ticketCategoryId: number;
  noOfTicket: number;
  eventId: number;
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
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  disclaimerAccepted: boolean;
}

interface MarathonRegistrationResponse {
  statusCode: number;
  message?: string;
  data?: {
    registrationId?: number;
  } | null;
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
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  tShirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  tshirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  disclaimerAccepted: boolean;
  createdAt?: string;
}

interface MarathonRegistrationGetResponse {
  statusCode: number;
  message?: string;
  data?: MarathonRegistrationDetails | MarathonRegistrationDetails[] | null;
}

export interface ActiveCorporate {
  corporateId: number;
  corporateName: string;
}

/**
 * Placeholder districts until a dedicated API is wired.
 * Replace with fetched options when the endpoint is available.
 */
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

interface ActiveCorporatesResponse {
  statusCode: number;
  message?: string;
  data?: ActiveCorporate[] | null;
}

export async function submitMarathonRegistration(
  payload: MarathonRegistrationPayload
): Promise<{ success: boolean; message: string; registrationId?: number }> {
  try {
    const response = await apiConnector<MarathonRegistrationResponse>({
      method: "POST",
      url: `${BASE_URL}/ticketcore-api/api/v1/marathon-registrations`,
      bodyData: payload,
      withCredentials: true,
      headers: {
        "X-Client-Source": "WEB",
      },
    });

    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      return {
        success: true,
        message: response.data.message || "Registration submitted successfully.",
        registrationId: response.data.data?.registrationId,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to submit registration.",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        (error.response?.data as { message?: string } | undefined)?.message ||
        "Failed to submit registration.";
      return { success: false, message: apiMessage };
    }

    return { success: false, message: "Something went wrong. Please try again." };
  }
}

export async function getActiveCorporates(): Promise<{
  success: boolean;
  message: string;
  data: ActiveCorporate[];
}> {
  try {
    const response = await apiConnector<ActiveCorporatesResponse>({
      method: "GET",
      url: `${BASE_URL}/ticketcore-api/api/v1/corporates/active`,
      withCredentials: true,
      headers: {
        "X-Client-Source": "WEB",
      },
    });

    if (response.data.statusCode === 200) {
      return {
        success: true,
        message:
          response.data.message || "Active corporate list fetched successfully.",
        data: response.data.data ?? [],
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to fetch active corporates.",
      data: [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        (error.response?.data as { message?: string } | undefined)?.message ||
        "Failed to fetch active corporates.";
      return { success: false, message: apiMessage, data: [] };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: [],
    };
  }
}


export async function getMarathonRegistrationByUserId(
  userId: number
): Promise<{
  success: boolean;
  message: string;
  data: MarathonRegistrationDetails | null;
}> {
  try {
    const response = await apiConnector<MarathonRegistrationGetResponse>({
      method: "GET",
      url: `${BASE_URL}/ticketcore-api/api/v1/marathon-registrations/booking/${userId}`,
      withCredentials: true,
      headers: {
        "X-Client-Source": "WEB",
      },
    });

    if (response.data.statusCode === 200) {
      const rawData = response.data.data;
      const normalizedData = Array.isArray(rawData)
        ? rawData[0] ?? null
        : rawData ?? null;

      return {
        success: true,
        message: response.data.message || "Registration fetched successfully.",
        data: normalizedData,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to fetch registration.",
      data: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const apiMessage =
        (error.response?.data as { message?: string } | undefined)?.message ||
        "Failed to fetch registration.";

      // Treat not found as "no registration yet" so user can submit.
      if (status === 404) {
        return {
          success: true,
          message: "No registration found for this user.",
          data: null,
        };
      }

      return { success: false, message: apiMessage, data: null };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
      data: null,
    };
  }
}
