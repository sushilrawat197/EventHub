export type SessionExpiredReason = "refresh_unauthorized" | "logout";
export type SessionExpiredPayload = { reason: SessionExpiredReason };

type SessionExpiredHandler = (payload: SessionExpiredPayload) => void;

const sessionExpiredListeners = new Set<SessionExpiredHandler>();

export function onSessionExpired(handler: SessionExpiredHandler): () => void {
  sessionExpiredListeners.add(handler);
  return () => sessionExpiredListeners.delete(handler);
}

export function emitSessionExpired(payload: SessionExpiredPayload): void {
  sessionExpiredListeners.forEach((handler) => handler(payload));
}

