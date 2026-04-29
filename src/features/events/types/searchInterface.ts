interface PriceGroup {
  min: number;
  max: number;
}

export interface EventSearchFilters {
  cityId?: number;               // optional
  genres?: string[];             // list of genres
  languages?: string[];          // list of languages
  datePresets?: ("TODAY" | "TOMORROW" | "WEEKEND")[]; // predefined options
  venueIds?: number[];           // list of venue IDs
  priceGroups?: PriceGroup[];    // price ranges
  startDate?: string | null;     // can be null or ISO string
  endDate?: string | null;       // can be null or ISO string
}
