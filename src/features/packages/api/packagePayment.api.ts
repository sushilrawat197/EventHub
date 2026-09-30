import { apiConnector } from "@/lib/api/connector";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { PAYMENT_INITIATE_TIMEOUT_MS } from "@/features/payment/api/endpoints";
import type { PackagePaymentResult } from "../types/packageReservation";
import { packagePaymentEndpoints } from "./endpoints";

export type PaymentPurpose = "INITIAL" | "BALANCE";

export interface PaymentPayload {
  packageBookingId: number;
  phoneNumber: string;
  purpose?: PaymentPurpose;
}

export interface CardInitiateResult {
  iframeHtml: string;
  /** Package card initiate returns this id. */
  packagePaymentId?: number;
  /** Event card initiate uses this name. Kept so either response can open the iframe. */
  paymentId?: number;
  extTransactionId: string;
}

export interface PaymentStatusResult {
  bookingId: number;
  status?: string;
  payment?: { status?: string };
}

const initiateConfig = { timeout: PAYMENT_INITIATE_TIMEOUT_MS, suppressTimeoutPopup: true } as const;

export function packageMpesaPayApi(payload: PaymentPayload) {
  return client.post<PackagePaymentResult, PaymentPayload>(packagePaymentEndpoints.mpesaPay(), payload, initiateConfig);
}

export function packageEcoCashPayApi(payload: PaymentPayload) {
  return client.post<PackagePaymentResult, PaymentPayload>(packagePaymentEndpoints.econetPay(), payload, initiateConfig);
}

export function packageCardInitiateApi(payload: PaymentPayload) {
  return client.post<CardInitiateResult, PaymentPayload>(packagePaymentEndpoints.cpayCardInitiate(), payload, initiateConfig);
}

export async function packageCpayInitiateApi(payload: PaymentPayload): Promise<string> {
  const response = await apiConnector<{ statusCode: number; message?: string }>({
    method: "POST",
    url: packagePaymentEndpoints.cpayInitiate(),
    bodyData: payload,
    ...initiateConfig,
  });
  if (response.data.statusCode === 200) return response.data.message ?? "OTP sent";
  throw new ApiError(response.data.message || "Could not start C-Pay payment", response.data.statusCode);
}

export function packageCpayPayApi(payload: PaymentPayload & { otp: string }) {
  return client.post<PackagePaymentResult, PaymentPayload & { otp: string }>(packagePaymentEndpoints.cpayPay(), payload);
}

export async function packagePaymentStatusApi(paymentId: number) {
  const response = await apiConnector<{ statusCode: number; message?: string; data: PaymentStatusResult }>({
    method: "GET",
    url: packagePaymentEndpoints.status(paymentId),
  });
  return response.data;
}
