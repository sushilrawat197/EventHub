export const GLOBAL_POPUP_EVENT = "eventhub:global-popup";

export type GlobalPopupVariant = "error" | "success" | "info";

export type GlobalPopupDetail = {
  message: string;
  variant?: GlobalPopupVariant;
  durationMs?: number;
};

export function showGlobalPopup(detail: GlobalPopupDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<GlobalPopupDetail>(GLOBAL_POPUP_EVENT, { detail }));
}

