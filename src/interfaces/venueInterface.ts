

export interface VenueResponse {
  venueId: number;
  name: string;
  address: string;
  description: string;
  pincode: string;
  latitude: number;
  longitude: number;
  venueType: string;
  totalCapacity: number;
  contactNumber: string;
  email: string;
  prohibitedItemsImageUrl: string;
  layoutSchemaImageUrl: string;
  supportedEvents: string[];
  status: string | null;
  images: VenueImage[];
  facilities: Facility[];
  city: LocationInfo;
  region: LocationInfo;
  country: LocationInfo;
}

export interface VenueImage {
  id: number;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
}

export interface Facility {
  facilityId: number;
  name: string;
  description: string;
  active: boolean;
}

export interface LocationInfo {
  id: number;
  label: string;
}
