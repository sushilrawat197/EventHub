// 🎭 Artist
export interface Artist {
  artistId: number;
  name: string;
  role: string;
  discription: string;
  imageUrl: string | null;
}

// 🏟️ Venue
export interface Venue {
  venueId: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  facilities: string[];
}

// 🎟️ Ticket Category (currently empty array but we define it for future)
export interface TicketCategory {
  categoryId?: number;
  categoryName?: string;
  price?: number;
  availableSeats?: number;
}

// ⏰ Show
export interface Show {
  showId: number;
  showDateTime: string; // ISO DateTime string
  maxTicketsPerPerson: number;
  availableSeats: number;
  venue: Venue;
  ticketCategories: TicketCategory[];
}


// 🎬 Content / Event
export interface Content {
  parentCategoryId: number;
  contentId: number;
  contentName: string;
  title: string;
  longDescription: string;
  shortDescription: string;
  genre: string;
  posterUrl: string;
  thumbnail: string;
  imageUrl: string | null;
  videoTrailerUrl: string;
  termsNConditions: string;
  defaultLang: string;
  durationMinutes: number;
  ageRestriction: number;
  releaseDate: string; // YYYY-MM-DD
  basePrice: number;
  likes: number;
  interest: number;
  isActive: boolean;
  artists: Artist[];
  shows: Show[];
}



// 📦 Full API Response
export interface EventsApiResponse {
  data: {
    eventList: Content[];     // yaha array me tumhara Content aayega
    catogeryList: string[];
    venueList: string[];
  };
}