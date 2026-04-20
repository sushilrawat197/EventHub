import { useEffect, useRef, useState } from "react";
import { GLOBAL_POPUP_EVENT, type GlobalPopupDetail } from "../../../utils/globalPopup";

const DEFAULT_DURATION_MS = 3000;

export default function GlobalPopup() {
  const [popup, setPopup] = useState<GlobalPopupDetail | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearPopupTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const onPopup = (event: Event) => {
      const customEvent = event as CustomEvent<GlobalPopupDetail>;
      const detail = customEvent.detail;
      if (!detail?.message) return;

      clearPopupTimer();
      setPopup(detail);

      timerRef.current = window.setTimeout(() => {
        setPopup(null);
        timerRef.current = null;
      }, detail.durationMs ?? DEFAULT_DURATION_MS);
    };

    window.addEventListener(GLOBAL_POPUP_EVENT, onPopup as EventListener);
    return () => {
      window.removeEventListener(GLOBAL_POPUP_EVENT, onPopup as EventListener);
      clearPopupTimer();
    };
  }, []);

  if (!popup) return null;

  const colorClasses =
    popup.variant === "success"
      ? "from-emerald-500 to-emerald-600"
      : popup.variant === "info"
      ? "from-sky-500 to-indigo-500"
      : "from-rose-500 to-orange-500";

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 px-4">
      <div
        role="alert"
        aria-live="polite"
        className={`w-fit max-w-[90vw] rounded-2xl bg-gradient-to-r ${colorClasses} p-[1px] shadow-2xl`}
      >
        <div className="rounded-2xl bg-neutral-900/95 px-5 py-3 text-sm font-medium text-white backdrop-blur-md">
          {popup.message}
        </div>
      </div>
    </div>
  );
}

