/**
 * How a currency code is shown next to a price.
 * API values stay as ISO codes (for example "LSL"); only the label changes.
 * Mapped symbols attach to the amount: M500. Unmapped codes keep a space: USD 500.
 */
export const CURRENCY_DISPLAY: Record<string, string> = {
  LSL: "M",
};

export function currencySymbol(currency: string | null | undefined): string | undefined {
  const code = currency?.trim().toUpperCase();
  if (!code) return undefined;
  return CURRENCY_DISPLAY[code];
}
