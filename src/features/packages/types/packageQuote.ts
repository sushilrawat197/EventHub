export interface PackageQuoteCustomer {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface PackageQuoteDeparture {
  departureId?: number | null;
  date?: string | null;
  returnDate?: string | null;
}

export interface PackageQuotePackageInfo {
  packageId?: number | null;
  packageName?: string | null;
  packageCode?: string | null;
  coverImage?: string | null;
}

export interface PackageQuotePickupPoint {
  pickupPointId?: number | null;
  name?: string | null;
  location?: string | null;
  pickupTime?: string | null;
}

export interface PackageQuoteActivity {
  activityId: number;
  quantity: number;
  name?: string | null;
  price?: number | null;
}

export interface PackageQuoteRequestItem {
  quoteRequestId: number;
  quoteReference: string;
  status: string; // PENDING, UNDER_REVIEW, QUOTED, OFFERED, ACCEPTED, REJECTED, EXPIRED, CANCELLED
  message: string;
  adminNotes?: string | null;
  agencyNotes?: string | null;
  responseNotes?: string | null;
  quotedAmount?: number | null;
  quotedPrice?: number | null;
  currency?: string | null;
  createdAt?: string | null;
  createdDateTime?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;

  // Package fields (may be nested or flat depending on serializer)
  packageId?: number | null;
  packageName?: string | null;
  packageCode?: string | null;
  coverImage?: string | null;
  package?: PackageQuotePackageInfo | null;

  // Departure & timing
  departureId?: number | null;
  departureDate?: string | null;
  returnDate?: string | null;
  departure?: PackageQuoteDeparture | null;

  // Travellers
  adults?: number | null;
  children?: number | null;
  infants?: number | null;
  totalTravellers?: number | null;

  // Pickup
  pickupPointId?: number | null;
  pickupPointName?: string | null;
  pickup?: PackageQuotePickupPoint | null;

  // Customer
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customer?: PackageQuoteCustomer | null;

  // Activities
  activities?: PackageQuoteActivity[] | null;
}
