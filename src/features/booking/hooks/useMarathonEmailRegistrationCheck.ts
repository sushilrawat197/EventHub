import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkMarathonRegistrationByEmail,
  isValidMarathonEmail,
  marathonEmailCheckCacheKey,
  resolveMarathonEmailCheckOutcome,
  type MarathonEmailCheckOutcome,
} from "../api/marathonRegistration";

const DEFAULT_DEBOUNCE_MS = 500;

interface UseMarathonEmailRegistrationCheckOptions {
  eventId: number | null | undefined;
  email: string;
  enabled?: boolean;
  debounceMs?: number;
}

export function useMarathonEmailRegistrationCheck({
  eventId,
  email,
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseMarathonEmailRegistrationCheckOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<MarathonEmailCheckOutcome>({ type: "available" });

  const lastCheckedKeyRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const emailRef = useRef(email);

  emailRef.current = email;

  const resetCheckState = useCallback(() => {
    lastCheckedKeyRef.current = null;
    setOutcome({ type: "available" });
    setError(null);
    setLoading(false);
  }, []);

  const runCheck = useCallback(async () => {
    if (!enabled || eventId == null || Number.isNaN(eventId)) return;

    const trimmedEmail = emailRef.current.trim();
    if (!isValidMarathonEmail(trimmedEmail)) {
      resetCheckState();
      return;
    }

    const cacheKey = marathonEmailCheckCacheKey(eventId, trimmedEmail);
    if (lastCheckedKeyRef.current === cacheKey) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    const result = await checkMarathonRegistrationByEmail(eventId, trimmedEmail);

    if (requestId !== requestIdRef.current) return;

    setLoading(false);

    if (!result.success || !result.data) {
      setError(result.message);
      return;
    }

    lastCheckedKeyRef.current = cacheKey;
    setOutcome(resolveMarathonEmailCheckOutcome(result.data));
  }, [enabled, eventId, resetCheckState]);

  useEffect(() => {
    if (!enabled || eventId == null || Number.isNaN(eventId)) {
      resetCheckState();
      return;
    }

    const trimmedEmail = email.trim();
    const nextCacheKey = isValidMarathonEmail(trimmedEmail)
      ? marathonEmailCheckCacheKey(eventId, trimmedEmail)
      : null;

    if (lastCheckedKeyRef.current && lastCheckedKeyRef.current !== nextCacheKey) {
      lastCheckedKeyRef.current = null;
      setOutcome({ type: "available" });
      setError(null);
    }

    if (!nextCacheKey) {
      setLoading(false);
      setError(null);
      setOutcome({ type: "available" });
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void runCheck();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [email, eventId, enabled, debounceMs, runCheck, resetCheckState]);

  const handleEmailBlur = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    void runCheck();
  }, [runCheck]);

  const isRegistrationBlocked = outcome.type === "confirmed_blocked";

  return {
    loading,
    error,
    outcome,
    handleEmailBlur,
    isRegistrationBlocked,
  };
}
