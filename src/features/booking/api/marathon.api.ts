import axios from "axios";
import { apiConnector } from "@/lib/api/connector";
import { client } from "@/lib/api/client";
import { extractApiFailureMessage, getApiErrorMessage } from "@/lib/api/errors";
import { marathonEndpoints } from "./endpoints";
import type {
  ActiveCorporate,
  MarathonEmailRegistrationCheckData,
  MarathonRegistrationDetails,
  MarathonRegistrationPayload,
} from "../types/marathon";
import { isValidMarathonEmail } from "../types/marathon";

export async function checkMarathonRegistrationByEmailApi(
  eventId: number,
  emailAddress: string
): Promise<{
  success: boolean;
  message: string;
  data: MarathonEmailRegistrationCheckData | null;
}> {
  const trimmedEmail = emailAddress.trim();

  if (!isValidMarathonEmail(trimmedEmail)) {
    return {
      success: false,
      message: "Enter a valid email address.",
      data: null,
    };
  }

  try {
    const response = await apiConnector<{
      statusCode: number;
      message?: string;
      data?: MarathonEmailRegistrationCheckData | null;
    }>({
      method: "GET",
      url: marathonEndpoints.check(),
      params: { eventId, emailAddress: trimmedEmail },
    });

    if (response.data.statusCode === 200 && response.data.data) {
      return {
        success: true,
        message: response.data.message || "Registration status checked.",
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to check registration status.",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to check registration status."),
      data: null,
    };
  }
}

export async function submitMarathonRegistrationApi(
  payload: MarathonRegistrationPayload
): Promise<{ success: boolean; message: string; registrationId?: number }> {
  try {
    const data = await client.post<{ registrationId?: number }, MarathonRegistrationPayload>(
      marathonEndpoints.submit(),
      payload
    );

    return {
      success: true,
      message: "Registration submitted successfully.",
      registrationId: data?.registrationId,
    };
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? extractApiFailureMessage(
          error.response?.data,
          "Failed to submit registration."
        )
      : getApiErrorMessage(error, "Failed to submit registration.");

    return {
      success: false,
      message,
    };
  }
}

export async function getActiveCorporatesApi(): Promise<{
  success: boolean;
  message: string;
  data: ActiveCorporate[];
}> {
  try {
    const data = await client.get<ActiveCorporate[]>(marathonEndpoints.activeCorporates());
    return {
      success: true,
      message: "Active corporate list fetched successfully.",
      data: data ?? [],
    };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch active corporates."),
      data: [],
    };
  }
}

export async function getMarathonRegistrationByUserIdApi(userId: number): Promise<{
  success: boolean;
  message: string;
  data: MarathonRegistrationDetails | null;
}> {
  try {
    const response = await apiConnector<{
      statusCode: number;
      message?: string;
      data?: MarathonRegistrationDetails | MarathonRegistrationDetails[] | null;
    }>({
      method: "GET",
      url: marathonEndpoints.byUser(userId),
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
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        success: true,
        message: "No registration found for this user.",
        data: null,
      };
    }

    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to fetch registration."),
      data: null,
    };
  }
}
