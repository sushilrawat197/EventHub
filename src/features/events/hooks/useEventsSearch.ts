import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
