import type { EventSearchFilters } from "../store/filter_Slice";

export const eventsQueryKeys = {
  all: ["events"] as const,
  search: (filters: EventSearchFilters) => ["events", "search", filters] as const,
  searchInfinite: (filters: EventSearchFilters) =>
    ["events", "search", "infinite", filters] as const,
  detail: (eventId: string) => ["events", "detail", eventId] as const,
  /** Related “You May Also Like” — keyed by category so detail pages share cache. */
  relatedByCategory: (category: string) => ["events", "related", category] as const,
};
