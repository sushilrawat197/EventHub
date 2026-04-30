// TODO: TEMP EVENT-39 FLOW - remove this API module after marathon registration flow is retired.
import axios from "axios";
import { apiConnector } from "../../../services/apiConnector";

const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

export interface MarathonRegistrationPayload {
  userId: number;
  name: string;
  surname: string;
  identityType: "LS_CITIZEN" | "FOREIGN_NATIONAL";
  idNumber: string | null;
  passportNumber: string | null;
  emailAddress: string;
  cellNumber: string;
  district: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  disclaimerAccepted: boolean;
}

interface MarathonRegistrationResponse {
  statusCode: number;
  message?: string;
}

export interface MarathonRegistrationDetails {
  registrationId?: number;
  userId: number;
  name: string;
  surname: string;
  identityType: "LS_CITIZEN" | "FOREIGN_NATIONAL";
  idNumber: string | null;
  passportNumber: string | null;
  emailAddress: string;
  cellNumber: string;
  district: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  tShirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  disclaimerAccepted: boolean;
}

interface MarathonRegistrationGetResponse {
  statusCode: number;
  message?: string;
  data?: MarathonRegistrationDetails | MarathonRegistrationDetails[] | null;
}

export async function submitMarathonRegistration(
  payload: MarathonRegistrationPayload
): Promise<{ success: boolean; message: string }> {
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
