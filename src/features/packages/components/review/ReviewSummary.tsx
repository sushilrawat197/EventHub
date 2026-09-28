import { AlertCircle, ArrowRight, CalendarDays, Loader2, MapPin, MessageCircle } from "lucide-react";
import { formatDate, formatMoney, friendlyLabel, type DepartureView, type PickupView } from "../../utils/packageDetailFormat";
import type { PackagePreviewPayment } from "../../types/packageReservation";
import { SafeImage } from "../detail/primitives";

function PriceQuote({
  payment,
  currency,
  pending,
  error,
  waitingMessage,
}: {
  payment?: PackagePreviewPayment | null;
  currency: string;
  pending: boolean;
  error?: string;
  waitingMessage?: string;
}) {
  const money = (amount: number | null | undefined) => formatMoney(amount ?? 0, currency);
  const isDeposit = payment?.paymentType?.toUpperCase() === "DEPOSIT" && (payment.balanceAmount ?? 0) > 0;

  return (
    <div className="mt-4 border-t border-dashed border-slate-200 pt-4 dark:border-slate-700">
      {pending ? (
        <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Calculating price…
        </p>
      ) : error ? (
        <p role="alert" className="flex gap-2 text-sm font-medium text-rose-600 dark:text-rose-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : payment ? (
        <>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {isDeposit ? "Deposit due now" : "Amount due now"}
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {money(payment.amountDueNow)}
            </span>
          </div>
          {payment.balanceAmount > 0 ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Balance {money(payment.balanceAmount)}
              {payment.balanceDueDate ? ` due by ${formatDate(payment.balanceDueDate)}` : ""}.
            </p>
          ) : null}
          {payment.paymentType ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{friendlyLabel(payment.paymentType)}</p>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {waitingMessage ?? "Select a departure and pickup to see the price."}
        </p>
      )}
    </div>
  );
}

export default function ReviewSummary({
  packageName,
  image,
  departure,
  pickup,
  travellers,
  payment,
  currency,
  pricePending,
  priceError,
  priceHint,
  submitting,
  submitError,
  onSubmit,
  onRequestQuote,
}: {
  packageName: string;
  image?: string;
  departure?: DepartureView;
  pickup?: PickupView;
  travellers: { type: string; label: string; quantity: number }[];
  payment?: PackagePreviewPayment | null;
  currency: string;
  pricePending: boolean;
  priceError?: string;
  priceHint?: string;
  submitting: boolean;
  submitError?: string;
  onSubmit: () => void;
  onRequestQuote: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
        <SafeImage src={image} alt={packageName} className="size-16 shrink-0 rounded-xl" iconClassName="size-5" />
        <div className="min-w-0">
          <p className="line-clamp-2 font-bold text-slate-900 dark:text-white">{packageName}</p>
          {departure ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              {departure.start}
              {departure.end && departure.end !== departure.start ? ` → ${departure.end}` : ""}
            </p>
          ) : null}
          {pickup ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {pickup.name ?? pickup.address}
                {pickup.time ? ` · ${pickup.time}` : ""}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Price summary</h2>
        {travellers.length ? (
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            {travellers.map((row) => (
              <li key={row.type} className="flex justify-between gap-3">
                <span>{row.label}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{row.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Add travellers to see the price.</p>
        )}

        <PriceQuote
          payment={payment}
          currency={currency}
          pending={pricePending}
          error={priceError}
          waitingMessage={priceHint}
        />

        {submitError ? (
          <p role="alert" className="mt-4 flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            {submitError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
          {submitting ? "Continuing…" : "Continue to payment"}
        </button>
        <button
          type="button"
          onClick={onRequestQuote}
          disabled={submitting}
          className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <span>
            <span className="block text-sm font-semibold text-slate-900 dark:text-white">Request a Quote</span>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">Travel agency contacts you</span>
          </span>
          <MessageCircle className="size-4 shrink-0 text-blue-600" aria-hidden />
        </button>
      </div>
    </div>
  );
}
