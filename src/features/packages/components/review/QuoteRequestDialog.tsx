import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Check, Clock, Loader2, MessageSquareQuote, Send, X } from "lucide-react";
import type { PackageQuoteResponse } from "../../types/packageReservation";

const QUICK_TOPICS = [
  "Custom travel dates",
  "Group booking discount",
  "Private cab / transport",
  "Hotel & room upgrade",
];

export default function QuoteRequestDialog({
  open,
  packageName: _packageName,
  customerName: _customerName,
  submitting,
  error,
  result,
  onClose,
  onSubmit,
}: {
  open: boolean;
  packageName?: string;
  customerName?: string;
  submitting: boolean;
  error?: string;
  result?: PackageQuoteResponse;
  onClose: () => void;
  onSubmit: (message: string) => void;
}) {
  const navigate = useNavigate();
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
      setMessageError("Please enter your inquiry details for the travel agency.");
      return;
    }
    setMessageError(undefined);
    onSubmit(text);
  }

  function handleTopicClick(topic: string) {
    setMessage((prev) => {
      const addition = `I'd like to inquire about ${topic.toLowerCase()}.`;
      if (!prev.trim()) return addition;
      if (prev.includes(addition)) return prev;
      return `${prev.trim()} ${addition}`;
    });
    setMessageError(undefined);
  }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-jakarta backdrop-blur-sm bg-slate-950/50 transition-all">
      <button
        type="button"
        aria-label="Close quote request"
        className="absolute inset-0 bg-transparent"
        onClick={() => !submitting && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Decorative top gradient accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4.5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <X className="size-4.5" aria-hidden />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-6 sm:p-7">
          {result ? (
            <div className="py-2 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-950/30">
                <Check className="size-8 stroke-[2.5]" aria-hidden />
              </div>
              <h2 id={titleId} className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
                Quote Request Sent!
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {result.message || "Your quote request has been submitted successfully. The travel agency will review your details and contact you shortly."}
              </p>
              {result.quoteReference ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Reference:</span>
                  <span className="font-mono font-bold">{result.quoteReference}</span>
                </div>
              ) : null}
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/quotes");
                  }}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  View My Quotes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/60 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-900/30">
                  <MessageSquareQuote className="size-5.5" aria-hidden />
                </div>
                <div className="min-w-0 pr-6">
                  {/* <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                    <Sparkles className="size-3" aria-hidden />
                    Custom Inquiry
                  </div> */}
                  <h2 id={titleId} className="mt-1 text-lg font-bold text-slate-950 dark:text-white sm:text-xl">
                    Request a Quote
                  </h2>
                </div>
              </div>

              {/* Package & Contact Card */}
              {/* <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">Package</span>
                  {customerName ? (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <User className="size-3" aria-hidden />
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{customerName}</span>
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-semibold text-slate-900 line-clamp-1 dark:text-white">
                  {packageName}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  The agency will contact you directly with tailored pricing & details.
                </p>
              </div> */}

              {/* Quick suggestions */}
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Quick suggestions:
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicClick(topic)}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-xs transition hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                    >
                      + {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label htmlFor={messageId} className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Your Requirements / Message
                  </label>
                  <span className={`text-xs ${message.length > 450 ? "font-semibold text-amber-600" : "text-slate-400 dark:text-slate-500"}`}>
                    {message.length}/500
                  </span>
                </div>
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
                  placeholder="e.g. We would like to customize the travel dates, request private car pickup, or get group rates for 4 adults..."
                  className="mt-1.5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400"
                />
              </div>

              {/* Micro Assurance */}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                <span>The travel agency usually responds within a few hours.</span>
              </div>

              {messageError ? <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">{messageError}</p> : null}
              {error ? (
                <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                  {error}
                </p>
              ) : null}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="size-4" aria-hidden />
                  )}
                  {submitting ? "Sending…" : "Submit request"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
