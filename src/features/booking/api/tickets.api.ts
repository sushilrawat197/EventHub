import { client } from "@/lib/api/client";
import type { TicketCategory } from "../store/ticketCategory";
import { bookingEndpoints } from "./endpoints";

export async function listTicketCategoriesByShowIdApi(
  showId: number
): Promise<TicketCategory[]> {
  return client.get<TicketCategory[]>(bookingEndpoints.ticketCategories(showId));
}
