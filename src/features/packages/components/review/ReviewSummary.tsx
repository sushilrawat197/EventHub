import { AlertCircle, ArrowRight, Loader2, MessageSquareQuote } from "lucide-react";
import { formatMoney, type DepartureView, type PickupView } from "../../utils/packageDetailFormat";
import type { PackagePreviewPayment } from "../../types/packageReservation";
import PaymentScheduleCard from "../payment/PaymentScheduleCard";

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
  const total = payment ? (payment.amountDueNow ?? 0) + (payment.balanceAmount ?? 0) : 0;

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
        <div className="space-y-3">
          {isDeposit && (payment.balanceAmount ?? 0) > 0 ? (
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Total Price
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {money(total)}
              </span>
            </div>
          ) : null}

          <PaymentScheduleCard
            amountDueNow={payment.amountDueNow}
            balanceAmount={payment.balanceAmount}
            balanceDueDate={payment.balanceDueDate}
            currency={currency}
            isDeposit={isDeposit}
          />
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {waitingMessage ?? "Select a departure and pickup to see the price."}
        </p>
      )}
    </div>
  );
}

export default function ReviewSummary({
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
  packageName?: string;
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
      <div className="border-b border-slate-100 p-4 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Price summary</h2>
      </div>

      <div className="p-4">
        {travellers.length ? (
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
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
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
          {submitting ? "Continuing…" : "Continue to payment"}
        </button>

        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white px-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={onRequestQuote}
          disabled={submitting}
          className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border-2 border-blue-600/25 bg-blue-50/60 px-4 text-sm font-semibold text-blue-700 shadow-xs transition-all duration-200 hover:border-blue-600/40 hover:bg-blue-100/70 hover:text-blue-800 hover:shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/50"
        >
          <MessageSquareQuote className="size-4.5 text-blue-600 transition-transform duration-200 group-hover:scale-110 dark:text-blue-400" aria-hidden />
          <span>Request a Quote</span>
        </button>

        <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Travel agency will contact you with custom details
        </p>
      </div>
    </div>
  );
}
