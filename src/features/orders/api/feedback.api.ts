import { client } from "@/lib/api/client";
import { feedbackEndpoints } from "./endpoints";

export async function submitServiceFeedbackApi(
  rating: number,
  comments: string
): Promise<void> {
  await client.post<null>(feedbackEndpoints.submit(), { rating, comments });
}
