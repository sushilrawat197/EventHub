export interface PackageOrder {
  bookingId: number;
  bookingRef: string;
  status: string;
  paymentStatus: string;
  orderDateTime: string | null;
  confirmedAt: string | null;
  expiresAt: string | null;
  packageInfo: {
    packageId: number;
    packageName: string;
    packageCode: string;
    coverImage: string | null;
  };
  departure: {
    departureId: number;
    date: string | null;
    returnDate: string | null;
  };
  pickup: {
    pickupPointId: number;
    name: string | null;
    location: string | null;
    pickupTime: string | null;
  } | null;
  contact: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    mobile: string | null;
  } | null;
  travellers: {
    adults: number;
    children: number;
    infants: number;
    other: number;
    total: number;
  };
  activities: PackageOrderActivity[];
  pricing: {
    packageAmount: number;
    activityAmount: number;
    taxAmount: number;
    feeAmount: number;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    amountDueNow: number;
    currency: string;
  };
  paymentPlan: {
    paymentType: string;
    depositAmount: number | null;
    amountDueNow: number;
    balanceAmount: number;
    balanceDueDate: string | null;
  } | null;
  cancellation: {
    policyType: string | null;
    summary: string | null;
    cancellable: boolean;
    rules: PackageOrderCancellationRule[];
  } | null;
  guests: PackageOrderGuest[];
  payments: PackageOrderPayment[];
}

export interface PackageOrderActivity {
  activityId: number;
  name: string;
  quantity: number;
  pricingBasis: string | null;
  unitPrice: number;
  totalAmount: number;
  currency: string;
}

export interface PackageOrderCancellationRule {
  fromDaysBeforeDeparture: number | null;
  toDaysBeforeDeparture: number | null;
  chargePercentage: number | null;
  refundPercentage: number | null;
  description: string | null;
}

export interface PackageOrderGuest {
  title: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  primary: boolean;
  type: string;
  age: number | null;
}

export interface PackageOrderPayment {
  packagePaymentId: number;
  purpose: string | null;
  paymentType: string | null;
  status: string;
  amount: number;
  currency: string;
  transactionRef: string | null;
  transactionId: string | null;
  requestedAt: string | null;
  completedAt: string | null;
}
