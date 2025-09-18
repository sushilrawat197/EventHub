// src/features/Events/EventTypes.ts

export interface Artist {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  dateOfBirth: string; // ISO string from backend
  nationality: string;
  websiteUrl: string;
  instagramHandle: string | null;
  twitterHandle: string | null;
  active: boolean | null;
  role: string;
}

export interface EventResponse {
  eventId: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  termsAndConditions: string[];
  category: string;
  genre: string;
  languages: string[];
  durationMinutes: number;
  ageRestriction: number;
  certification: string;
  releaseDate: string; // ISO string
  posterUrl: string;
  thumbnailUrl: string;
  trailerUrl: string;
  basePrice: number;
  status: string;
  organizerId: number;
  artists: Artist[];
}



export interface EventResponseBySearch {
  eventId: number;
  eventName: string;
  posterUrl: string;
  thumbnailUrl: string;
  genre: string;      // agar fix enum hai to alag se type bana sakte ho
  language: string;   // agar fix list hai (English, Hindi, etc.) to enum use kar sakte ho
  venueName: string;
  city: string;
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
  price: number;
}