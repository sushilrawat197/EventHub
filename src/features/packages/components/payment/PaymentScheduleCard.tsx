import { CalendarClock, Check, CreditCard } from "lucide-react";
import { formatDate, formatMoney } from "../../utils/packageDetailFormat";

export interface PaymentScheduleCardProps {
  amountDueNow: number;
  balanceAmount?: number | null;
  balanceDueDate?: string | null;
  currency?: string | null;
  isDeposit?: boolean;
  paid?: boolean;
  className?: string;
}

export default function PaymentScheduleCard({
  amountDueNow,
  balanceAmount = 0,
  balanceDueDate,
  currency,
  isDeposit,
  paid = false,
  className = "",
}: PaymentScheduleCardProps) {
  const money = (amount: number | null | undefined) => formatMoney(amount ?? 0, currency);
  const remaining = Number(balanceAmount) || 0;
  const hasDepositPlan = isDeposit ?? remaining > 0;
  const formattedDueDate = formatDate(balanceDueDate);

  if (!hasDepositPlan) {
    return (
      <div
        className={`rounded-2xl border border-blue-200/90 bg-blue-50/40 p-4 transition-all duration-200 dark:border-blue-900/50 dark:bg-blue-950/20 ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-blue-600 dark:text-blue-400" aria-hidden />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {paid ? "Full Payment Confirmed" : "Pay in Full"}
            </span>
          </div>
          <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            {paid ? "Paid" : "100% upfront"}
          </span>
        </div>

        <div className="mt-3.5 flex items-baseline justify-between gap-3 pt-1">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {paid ? "Total paid" : "Pay to Book"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {paid ? "Payment completed" : "Amount to pay now to reserve"}
            </p>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {money(amountDueNow)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-blue-200/90 bg-blue-50/40 p-4 transition-all duration-200 dark:border-blue-900/60 dark:bg-blue-950/20 ${className}`}
    >
      {/* Option Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-blue-600 dark:text-blue-400" aria-hidden />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Book Now, Pay Later
          </span>
        </div>
        <span className="rounded-full bg-blue-100/80 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
          Deposit
        </span>
      </div>

      {/* Stepper Timeline */}
      <div className="mt-3.5 space-y-0">
        {/* Step 1 */}
        <div className="relative flex items-start gap-3">
          <div className="flex flex-col items-center">
            {paid ? (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                aria-hidden
              >
                <Check className="size-3.5 stroke-[2.5]" />
              </span>
            ) : (
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/70 dark:text-blue-200"
                aria-hidden
              >
                1
              </span>
            )}
            <div
              className="my-1 w-px flex-1 border-l-2 border-dotted border-blue-300 dark:border-blue-800"
              style={{ minHeight: "1.75rem" }}
              aria-hidden
            />
          </div>

          <div className="flex flex-1 items-start justify-between gap-2 pb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {paid ? "Deposit Paid" : "Pay to Book"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {paid ? "Paid at reservation" : "Amount to pay now to reserve"}
              </p>
            </div>
            <span className="text-base font-extrabold text-slate-900 tabular-nums dark:text-white">
              {money(amountDueNow)}
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              aria-hidden
            >
              2
            </span>
          </div>

          <div className="flex flex-1 items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {formattedDueDate ? `Before ${formattedDueDate}` : "Remaining balance"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Remaining balance</p>
            </div>
            <span className="text-base font-extrabold text-slate-900 tabular-nums dark:text-white">
              {money(remaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
