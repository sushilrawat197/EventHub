import { apiConnector } from "@/lib/api/connector";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { payTickeResponse } from "../types/payTicketInterface";
import { PAYMENT_INITIATE_TIMEOUT_MS, paymentEndpoints } from "./endpoints";

type PaymentPayload = {
  bookingId: number | null;
  phoneNumber: string | null;
};

type CpayPayPayload = PaymentPayload & { otp: string };

type CardInitiateData = {
  iframeHtml: string;
  paymentId: number;
  extTransactionId: string;
};

const initiateConfig = {
  timeout: PAYMENT_INITIATE_TIMEOUT_MS,
  suppressTimeoutPopup: true,
} as const;

export async function mpesaPayApi(payload: PaymentPayload): Promise<payTickeResponse> {
  return client.post<payTickeResponse, PaymentPayload>(
    paymentEndpoints.mpesaPay(),
    payload,
    initiateConfig
  );
}

export async function econetPayApi(payload: PaymentPayload): Promise<payTickeResponse> {
  return client.post<payTickeResponse, PaymentPayload>(
    paymentEndpoints.econetPay(),
    payload,
    initiateConfig
  );
}

export async function cpayCardInitiateApi(payload: PaymentPayload): Promise<CardInitiateData> {
  return client.post<CardInitiateData, PaymentPayload>(
    paymentEndpoints.cpayCardInitiate(),
    payload,
    initiateConfig
  );
}

export async function cpayInitiateApi(payload: PaymentPayload): Promise<string> {
  const response = await apiConnector<{ statusCode: number; message?: string }>({
    method: "POST",
    url: paymentEndpoints.cpayInitiate(),
    bodyData: payload,
    timeout: PAYMENT_INITIATE_TIMEOUT_MS,
    suppressTimeoutPopup: true,
  });

  if (response.data.statusCode === 200) {
    return response.data.message ?? "Payment initiated";
  }

  throw new ApiError(
    response.data.message || "Something went wrong",
    response.data.statusCode
  );
}

export async function cpayPayApi(payload: CpayPayPayload): Promise<payTickeResponse> {
  return client.post<payTickeResponse, CpayPayPayload>(
    paymentEndpoints.cpayPay(),
    payload
  );
}

export async function getPaymentStatusApi(paymentId: number) {
  return apiConnector<{ statusCode: number; message?: string; data: payTickeResponse }>({
    method: "GET",
    url: paymentEndpoints.status(paymentId),
  });
}

export async function mpesaRefundApi(bookingId: number): Promise<payTickeResponse> {
  return client.post<payTickeResponse, { bookingId: number }>(
    paymentEndpoints.mpesaRefund(),
    { bookingId }
  );
}
