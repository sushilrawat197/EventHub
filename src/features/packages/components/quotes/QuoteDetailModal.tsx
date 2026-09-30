import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageSquareQuote,
  Phone,
  Sparkles,
  Ticket,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { formatDate, formatMoney, plural } from "../../utils/packageDetailFormat";
import { SafeImage } from "../detail/primitives";
import { getPackageQuoteDetailApi } from "../../api/quotes.api";
import type { PackageQuoteRequestItem } from "../../types/packageQuote";

function QuoteStatusBadge({ status }: { status: string }) {
  const value = status?.toUpperCase() ?? "";

  if (value === "QUOTED" || value === "OFFERED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/60 dark:text-blue-300">
        <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
        Quote Received
      </span>
    );
  }
  if (value === "ACCEPTED" || value === "CONFIRMED" || value === "BOOKED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
        Accepted
      </span>
    );
  }
  if (value === "REJECTED" || value === "CANCELLED" || value === "DECLINED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300">
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300">
      <Clock className="size-3 text-amber-600 dark:text-amber-400" />
      Pending Review
    </span>
  );
}

export default function QuoteDetailModal({
  quoteRequestId,
  open,
  onClose,
}: {
  quoteRequestId: number | null;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["package-quote-detail", quoteRequestId],
    queryFn: () => getPackageQuoteDetailApi(quoteRequestId!),
    enabled: open && Boolean(quoteRequestId),
  });

  if (!open || !quoteRequestId) return null;

  const quote = data as PackageQuoteRequestItem | undefined;

  const packageName =
    quote?.packageName ?? quote?.package?.packageName ?? "Custom Tour Package";
  const packageId = quote?.packageId ?? quote?.package?.packageId;
  const coverImage =
    quote?.coverImage ?? quote?.package?.coverImage ?? undefined;
  const currency = quote?.currency ?? "LSL";

  const departureDate =
    quote?.departureDate ?? quote?.departure?.date ?? null;
  const returnDate = quote?.returnDate ?? quote?.departure?.returnDate ?? null;

  const quotedAmount = quote?.quotedAmount ?? quote?.quotedPrice ?? null;
  const agencyNotes =
    quote?.adminNotes ?? quote?.agencyNotes ?? quote?.responseNotes ?? null;

  const travellersCount = [
    quote?.adults ? plural(quote.adults, "adult") : "",
    quote?.children ? plural(quote.children, "child") : "",
    quote?.infants ? plural(quote.infants, "infant") : "",
  ]
    .filter(Boolean)
    .join(", ");

  const customerName =
    quote?.customerName ?? quote?.customer?.name ?? "Customer";
  const customerEmail = quote?.customerEmail ?? quote?.customer?.email ?? "";
  const customerPhone = quote?.customerPhone ?? quote?.customer?.phone ?? "";

  function copyRef() {
    if (!quote?.quoteReference) return;
    navigator.clipboard.writeText(quote.quoteReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 font-jakarta backdrop-blur-sm bg-slate-950/50">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:text-slate-400"
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </button>

        {isLoading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-slate-500">
              Loading quote details…
            </p>
          </div>
        ) : isError || !quote ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-rose-600">
              Failed to load quote details.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header: Ref & Status */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <QuoteStatusBadge status={quote.status} />
                <button
                  type="button"
                  onClick={copyRef}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Ticket className="size-3 text-blue-600" />
                  <span>REF: {quote.quoteReference}</span>
                  {copied ? (
                    <span className="text-emerald-600 font-sans text-[11px] font-bold">
                      Copied!
                    </span>
                  ) : (
                    <Copy className="size-3 text-slate-400" />
                  )}
                </button>
                {quote.createdAt ? (
                  <span className="text-xs text-slate-400">
                    Requested on {formatDate(quote.createdAt)}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {packageName}
              </h2>
            </div>

            {/* Quoted Price Banner (If provided by agency) */}
            {quotedAmount != null && quotedAmount > 0 ? (
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/90 to-indigo-50/70 p-5 dark:border-blue-900/40 dark:bg-blue-950/40">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                      <Sparkles className="size-3" /> Special Quoted Rate
                    </span>
                    <p className="mt-2 text-3xl font-black text-blue-700 dark:text-blue-300">
                      {formatMoney(quotedAmount, currency)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                      Exclusive custom rate proposed by the travel operator
                    </p>
                  </div>
                  {packageId ? (
                    <Link
                      to={`/packages/${quote.package?.packageCode ?? "pkg"}/${packageId}`}
                      className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95"
                    >
                      View Package & Book
                      <ExternalLink className="size-4" />
                    </Link>
                  ) : null}
                </div>

                {agencyNotes ? (
                  <div className="mt-4 border-t border-blue-200/60 pt-3 dark:border-blue-800/40">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
                      Operator Message:
                    </p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                      {agencyNotes}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      Awaiting Operator Proposal
                    </p>
                    <p className="mt-0.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                      Your quote request has been delivered to the travel
                      operator. You will be contacted with personalized dates and
                      rates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Package Summary Card */}
            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <SafeImage
                src={coverImage}
                alt={packageName}
                className="size-20 shrink-0 rounded-xl object-cover"
                iconClassName="size-8"
              />
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="font-bold text-slate-900 line-clamp-1 dark:text-white">
                  {packageName}
                </p>
                {departureDate ? (
                  <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <CalendarDays className="size-3.5 text-blue-600" />
                    <span>
                      {formatDate(departureDate)}
                      {returnDate && returnDate !== departureDate
                        ? ` → ${formatDate(returnDate)}`
                        : ""}
                    </span>
                  </p>
                ) : null}
                {travellersCount ? (
                  <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <Users className="size-3.5 text-indigo-600" />
                    <span>{travellersCount}</span>
                  </p>
                ) : null}
                {quote.pickupPointName || quote.pickup?.name ? (
                  <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <MapPin className="size-3.5 text-emerald-600" />
                    <span>{quote.pickupPointName ?? quote.pickup?.name}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {/* User Inquiry Message */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MessageSquareQuote className="size-3.5 text-blue-600" />
                <span>Your Inquiry / Note</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {quote.message || "No additional message provided."}
              </p>
            </div>

            {/* Contact Details */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <User className="size-3.5 text-slate-500" />
                <span>Contact Details Provided</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {customerName}
                </span>
                {customerEmail ? (
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Mail className="size-3.5 text-blue-600" />
                    {customerEmail}
                  </span>
                ) : null}
                {customerPhone ? (
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Phone className="size-3.5 text-emerald-600" />
                    {customerPhone}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
