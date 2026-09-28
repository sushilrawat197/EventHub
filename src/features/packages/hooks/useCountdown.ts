import { useEffect, useState } from "react";
import { msUntil } from "../utils/reservationStorage";

/** Ticks every second; `remainingMs` is undefined when there is no deadline. */
export function useCountdown(deadline: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());
  const remainingMs = msUntil(deadline, now);
  const running = remainingMs !== undefined && remainingMs > 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return {
    remainingMs,
    expired: remainingMs !== undefined && remainingMs <= 0,
    label: remainingMs !== undefined && remainingMs > 0 ? formatRemaining(remainingMs) : undefined,
  };
}

function formatRemaining(ms: number): string {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mmss = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return hours > 0 ? `${hours}:${mmss}` : mmss;
}
