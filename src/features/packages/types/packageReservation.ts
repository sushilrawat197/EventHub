import type { PackageDetail } from "./packageDetail";

export type TravellerType = "ADULT" | "CHILD" | "INFANT" | "SENIOR" | (string & {});

export interface ReservationTraveller {
  type: TravellerType;
  quantity: number;
  /** One age per child. */
  ages?: number[];
  /** Single age for an infant. */
  age?: number;
}

export interface ReservationActivity {
  activityId: number;
  quantity: number;
}

export interface ReservationGuest {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  type: TravellerType;
  primary?: boolean;
  age?: number;
}

export interface PackagePreviewPayment {
  paymentType: string;
  amountDueNow: number;
  balanceAmount: number;
  balanceDueDate: string | null;
  depositAmount: number | null;
}

/** Body for POST /public/packages/preview. CHILD rows include `ages`; INFANT rows include `age`. */
export interface PackagePreviewRequest {
  packageId: number;
  departureId: number;
  pickupPointId?: number;
  travellers: ReservationTraveller[];
}

/** Package view, plus the quoted payment for the selected departure and travellers. */
export interface PackagePreviewResponse extends PackageDetail {
  payment: PackagePreviewPayment;
}

export interface PackageReservationRequest {
  packageId: number;
  departureId: number;
  pickupPointId?: number;
  travellers: ReservationTraveller[];
  activities: ReservationActivity[];
  guestDetails: ReservationGuest[];
}

export interface PackageReservationResponse {
  bookingId: number;
  bookingRef: string;
  status: string;
  package: {
    packageId: number;
    packageName: string;
    packageCode: string;
  };
  departure: {
    departureId: number;
    date: string | null;
    returnDate: string | null;
  };
  travellers: {
    adults: number;
    children: number;
    infants: number;
    other: number;
    total: number;
  };
  pricing: {
    packageAmount: number;
    activityAmount: number;
    taxAmount: number;
    feeAmount: number;
    totalAmount: number;
    currency: string;
  };
  payment: {
    paymentType: string;
    amountDueNow: number;
    balanceAmount: number;
    balanceDueDate: string | null;
    depositAmount: number | null;
  };
  expiresAt: string | null;
}

/** What the payment page needs; kept in sessionStorage so a refresh doesn't lose it. */
export interface StoredPackageReservation {
  reservation: PackageReservationResponse;
  packagePath: string;
  coverImage?: string;
  pickupLabel?: string;
  leadMobile?: string;
  leadEmail?: string;
  paid?: boolean;
}

export interface PackageQuoteActivity {
  activityId: number;
  quantity: number;
}

export interface PackageQuoteRequest {
  packageId: number;
  departureId: number;
  adults: number;
  children: number;
  infants: number;
  pickupPointId?: number;
  activities: PackageQuoteActivity[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  message: string;
}

export interface PackageQuoteResponse {
  quoteRequestId: number;
  quoteReference: string;
  status: string;
  message: string;
}

export interface PackagePaymentResult {
  bookingId: number;
  status?: string;
  bookingReference?: string;
  payment?: { paymentId?: number; status?: string; amount?: number; transactionRef?: string };
}
