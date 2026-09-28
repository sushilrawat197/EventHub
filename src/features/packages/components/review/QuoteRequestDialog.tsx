import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, X } from "lucide-react";
import type { PackageQuoteResponse } from "../../types/packageReservation";

export default function QuoteRequestDialog({
  open,
  packageName,
  customerName,
  submitting,
  error,
  result,
  onClose,
  onSubmit,
}: {
  open: boolean;
  packageName: string;
  customerName?: string;
  submitting: boolean;
  error?: string;
  result?: PackageQuoteResponse;
  onClose: () => void;
  onSubmit: (message: string) => void;
}) {
  const titleId = useId();
  const messageId = useId();
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState<string>();

  useEffect(() => {
    if (!open) return;
    setMessage("");
    setMessageError(undefined);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, submitting]);

  if (!open) return null;

  function submit() {
    const text = message.trim();
    if (!text) {
      setMessageError("Add a short message for the travel agency.");
      return;
    }
    setMessageError(undefined);
    onSubmit(text);
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 font-jakarta sm:items-center">
      <button type="button" aria-label="Close quote request" className="absolute inset-0 bg-slate-950/45" onClick={() => !submitting && onClose()} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6 dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-slate-800"
        >
          <X className="size-4" aria-hidden />
          <span className="sr-only">Close</span>
        </button>

        {result ? (
          <div className="pr-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="size-5" aria-hidden />
            </span>
            <h2 id={titleId} className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Quote request sent
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {result.message || "Your quote request has been submitted successfully. The travel agency will contact you."}
            </p>
            {result.quoteReference ? (
              <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Reference <span className="font-semibold text-slate-950 dark:text-white">{result.quoteReference}</span>
              </p>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            className="pr-8"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <h2 id={titleId} className="text-lg font-semibold text-slate-950 dark:text-white">
              Request a quote
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Add a note for {packageName}. The travel agency will contact you
              {customerName ? ` at the details for ${customerName}` : ""}.
            </p>
            <label htmlFor={messageId} className="mt-4 block text-sm font-medium text-slate-800 dark:text-slate-200">
              Message
            </label>
            <textarea
              id={messageId}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setMessageError(undefined);
              }}
              rows={4}
              maxLength={500}
              autoFocus
              placeholder="We would like to discuss a private arrangement."
              className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            {messageError ? <p className="mt-1.5 text-xs font-medium text-rose-600">{messageError}</p> : null}
            {error ? (
              <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                {submitting ? "Sending…" : "Submit request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
