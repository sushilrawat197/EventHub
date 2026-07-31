import { useQuery } from "@tanstack/react-query";
import { getEventByIdApi } from "../api/eventsApi";
import { eventsQueryKeys } from "./eventsQueryKeys";

export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: eventsQueryKeys.detail(eventId ?? ""),
    queryFn: () => getEventByIdApi(eventId!),
    enabled: Boolean(eventId),
  });
}
