export interface PackageDestination {
  country: string | null;
  region: string | null;
  city: string | null;
  primaryDestination: string | null;
}

export interface PackageDuration {
  days: number;
  nights: number;
}

export interface PackageMedia {
  mediaId: number;
  packageId: number;
  mediaType: string;
  storageKey: string;
  mediaUrl: string;
  originalFileName: string | null;
  contentType: string | null;
  displayOrder: number;
  isPrimary: boolean;
  status: string;
}

export interface PackageItineraryDay {
  itineraryDayId: number;
  packageId: number;
  dayNumber: number;
  title: string;
  description: string | null;
  destinationCityId: number | null;
  destinationCityName: string | null;
  regionId: number | null;
  regionName: string | null;
  startTime: string | null;
  endTime: string | null;
  overnightStay: boolean;
  accommodationId: number | null;
  accommodationName: string | null;
  accommodationReference: string | null;
  displayOrder: number;
}

export interface PackageAccommodation {
  accommodationId: number;
  packageId: number;
  propertyName: string;
  accommodationTypeId: number | null;
  accommodationTypeCode: string | null;
  accommodationTypeName: string | null;
  accommodationTypeOtherDescription: string | null;
  roomType: string | null;
  roomTypeDescription: string | null;
  nights: number | null;
  sharingType: string | null;
  sharingTypeDescription: string | null;
  description: string | null;
  included: boolean;
  active: boolean;
  itineraryDayIds: number[];
  dayNumbers: number[];
  displayOrder: number;
}

export interface PackageMeal {
  mealId: number;
  packageId: number;
  itineraryDayId: number | null;
  dayNumber: number | null;
  mealTypeId: number | null;
  mealTypeCode: string | null;
  mealTypeName: string | null;
  included: boolean;
  description: string | null;
  displayOrder: number;
}

export interface PackageActivityMedia {
  activityMediaId: number;
  activityId: number;
  packageId: number;
  storageKey: string;
  mediaUrl: string;
  originalFileName: string | null;
  contentType: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface PackageActivity {
  activityId: number;
  packageId: number;
  itineraryDayId: number | null;
  dayNumber: number | null;
  activityName: string;
  shortDescription: string | null;
  description: string | null;
  activityType: string | null;
  location: string | null;
  durationValue: number | null;
  durationUnit: string | null;
  inclusionType: string | null;
  price: number | null;
  currency: string | null;
  pricingBasisCode?: string | null;
  pricingBasisName?: string | null;
  whatIsIncluded: string | null;
  whatToBring: string | null;
  requirements: string | null;
  minAge: number | null;
  maxAge: number | null;
  meetingPickupInfo: string | null;
  active: boolean;
  displayOrder: number;
  media: PackageActivityMedia[];
}

export interface PackageInclusion {
  inclusionId: number;
  packageId: number;
  categoryId: number | null;
  categoryCode: string | null;
  categoryName: string | null;
  listType: string;
  sourceType: string | null;
  description: string;
  displayOrder: number;
}

export interface PackagePriceRow {
  priceId: number;
  packageId: number;
  passengerType: string;
  amount: number;
  currency: string;
  pricingBasisCode: string | null;
  pricingBasisName: string | null;
  minAge: number | null;
  maxAge: number | null;
  active: boolean;
}

export interface PackagePricing {
  currency: string;
  fromPrice: number;
  pricingBasis: string;
  prices: PackagePriceRow[];
}

export interface PackagePaymentTerms {
  paymentTermsId: number;
  packageId: number;
  currency: string | null;
  depositType: string | null;
  initialPaymentType: string | null;
  calculationType: string | null;
  depositAmount: number | null;
  refundability: string | null;
  balanceDueAt: string | null;
  balanceDueDate: string | null;
  paymentDeadline: string | null;
  paymentMethods: string[];
  paymentInstructions: string | null;
}

export interface PackageCancellationRule {
  description?: string | null;
  daysBeforeDeparture?: number | null;
  chargePercentage?: number | null;
  refundPercentage?: number | null;
}

export interface PackageCancellationPolicy {
  policyType: string | null;
  rules: PackageCancellationRule[];
}

export interface PackageDeparture {
  departureId: number;
  packageId: number;
  departureDate: string | null;
  returnDate: string | null;
  status: string | null;
  notes: string | null;
  availableSeats?: number | null;
  displayOrder?: number | null;
}

export interface PackageTransport {
  transportId: number;
  packageId: number;
  transportIncluded: boolean;
  transportTypeId: number | null;
  transportTypeCode: string | null;
  transportTypeName: string | null;
  vehicleType: string | null;
  vehicleDescription: string | null;
  vehicleCapacity: number | null;
  pickupRequired: boolean;
  dropoffRequired: boolean;
  description: string | null;
  dayNumber: number | null;
  fromCityId: number | null;
  fromCityName: string | null;
  toCityId: number | null;
  toCityName: string | null;
  displayOrder: number;
}

export interface PackagePickupPoint {
  pickupPointId: number;
  packageId: number;
  departureId: number | null;
  name: string | null;
  address: string | null;
  cityId: number | null;
  cityName: string | null;
  regionId: number | null;
  regionName: string | null;
  pickupTime: string | null;
  pickupType: string | null;
  instructions: string | null;
  displayOrder: number;
  active: boolean;
}

export interface PackageDetail {
  packageId: number;
  packageCode: string;
  packageName: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  categoryCode: string | null;
  destination: PackageDestination | null;
  duration: PackageDuration | null;
  media: PackageMedia[];
  itinerary: PackageItineraryDay[];
  transport: PackageTransport[];
  pickupPoints: PackagePickupPoint[];
  departures?: PackageDeparture[];
  accommodation: PackageAccommodation[];
  meals: PackageMeal[];
  activities: PackageActivity[];
  inclusions: PackageInclusion[];
  exclusions: PackageInclusion[];
  pricing: PackagePricing | null;
  paymentTerms: PackagePaymentTerms | null;
  cancellationPolicy: PackageCancellationPolicy | null;
  tourOperatorName: string | null;
}
