import { useEffect, useRef, useState } from "react";
import { showGlobalPopup } from "../../../utils/globalPopup";

export default function NetworkStatusMonitor() {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const previousStatusRef = useRef<boolean>(navigator.onLine);

  useEffect(() => {
    const updateStatus = (nextStatus: boolean) => {
      const prevStatus = previousStatusRef.current;
      previousStatusRef.current = nextStatus;
      setIsOnline(nextStatus);

      // Notify only on real status transitions.
      if (prevStatus !== nextStatus && nextStatus) {
        showGlobalPopup({
          message: "You are back online.",
          variant: "success",
          durationMs: 2500,
        });
      }
    };

    const onOnline = () => updateStatus(true);
    const onOffline = () => updateStatus(false);
    const onVisibilityChange = () => updateStatus(navigator.onLine);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Sync once on mount in case app started offline.
    updateStatus(navigator.onLine);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[10000] -translate-x-1/2 px-4">
      <div className="w-fit max-w-[90vw] rounded-2xl bg-gradient-to-r from-slate-600 to-slate-800 p-[1px] shadow-2xl">
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl bg-neutral-900/95 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md"
        >
          You are offline. Please check your internet connection.
        </div>
      </div>
    </div>
  );
}

