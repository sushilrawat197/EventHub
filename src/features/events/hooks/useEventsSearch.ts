import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { searchEventsApi } from "../api/events.api";
import type { EventSearchFilters } from "../store/filter_Slice";
import { eventsQueryKeys } from "./eventsQueryKeys";

export function useEventsSearch(filters: EventSearchFilters, enabled = true) {
  return useQuery({
    queryKey: eventsQueryKeys.search(filters),
    queryFn: () => searchEventsApi(filters, 0),
    enabled,
  });
}

export function useEventsSearchInfinite(filters: EventSearchFilters) {
  return useInfiniteQuery({
    queryKey: eventsQueryKeys.searchInfinite(filters),
    queryFn: ({ pageParam }) => searchEventsApi(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.page + 1),
  });
}

const EMPTY_RELATED_FILTERS: EventSearchFilters = {
  categories: [],
  languages: [],
  datePresets: [],
  venueIds: [],
  priceGroups: [],
  startDate: null,
  endDate: null,
  eventName: null,
};

/**
 * Fetches same-category events for the detail “You May Also Like” slider.
 * Search list API expects `categories` only — never send genre.
 */
export function useRelatedEventsByCategory(
  category: string | undefined,
  excludeEventId: string | undefined
) {
  const filters = useMemo((): EventSearchFilters => {
    if (!category) return EMPTY_RELATED_FILTERS;
    return {
      ...EMPTY_RELATED_FILTERS,
      categories: [category],
    };
  }, [category]);

  return useQuery({
    queryKey: eventsQueryKeys.relatedByCategory(category ?? ""),
    queryFn: () => searchEventsApi(filters, 0),
    enabled: Boolean(category),
    staleTime: 60_000,
    // API already scopes by `categories`; only drop the current event from the slider
    select: (page) =>
      (page.content ?? []).filter(
        (e) =>
          excludeEventId == null || String(e.eventId) !== String(excludeEventId)
      ),
  });
}
