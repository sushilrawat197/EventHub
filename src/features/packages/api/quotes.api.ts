import { client } from "@/lib/api/client";
import type { PageData } from "@/lib/api/types";
import { packagesEndpoints } from "./endpoints";
import type { PackageQuoteRequestItem } from "../types/packageQuote";

export async function listMyPackageQuotesApi(
  page = 0,
  size = 10
): Promise<PageData<PackageQuoteRequestItem>> {
  return client.getPaginated<PackageQuoteRequestItem>(
    packagesEndpoints.myQuotes(page, size)
  );
}

export async function getPackageQuoteDetailApi(
  quoteRequestId: number | string
): Promise<PackageQuoteRequestItem> {
  return client.get<PackageQuoteRequestItem>(
    packagesEndpoints.quoteDetail(quoteRequestId)
  );
}
