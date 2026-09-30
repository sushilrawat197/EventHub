import { Check, Clock } from "lucide-react";
import { formatDate, formatMoney } from "../../utils/packageDetailFormat";
import type { PackageOrder } from "@/features/orders/types/packageOrder";

interface OrderPaymentScheduleProps {
  order: PackageOrder;
  className?: string;
}

export default function OrderPaymentSchedule({ order, className = "" }: OrderPaymentScheduleProps) {
  const currency = order.pricing?.currency ?? "MLT";
  const money = (amount: number | null | undefined) => formatMoney(amount ?? 0, currency);

  const payments = order.payments ?? [];
  const initialPayment = payments.find((p) => p.purpose === "INITIAL") ?? payments[0];
  const balancePayment = payments.find((p) => p.purpose === "BALANCE") ?? (payments.length > 1 ? payments[1] : undefined);

  const hasDepositPlan =
    order.paymentPlan?.paymentType === "DEPOSIT" ||
    (order.paymentPlan?.depositAmount != null && order.paymentPlan.depositAmount > 0) ||
    Boolean(balancePayment) ||
    (order.pricing?.balanceAmount != null && order.pricing.balanceAmount > 0) ||
    Boolean(order.paymentPlan?.balanceDueDate);

  // Initial payment info
  const initialAmount =
    initialPayment?.amount ??
    order.paymentPlan?.depositAmount ??
    (hasDepositPlan ? order.pricing?.paidAmount : order.pricing?.totalAmount) ??
    0;

  const initialPaidDate =
    initialPayment?.completedAt ??
    initialPayment?.requestedAt ??
    order.confirmedAt ??
    order.orderDateTime;

  const initialDateLabel = initialPaidDate
    ? `Paid on ${formatDate(initialPaidDate)}`
    : "Paid at reservation";

  // Balance payment info
  const isBalancePaid =
    (balancePayment && (balancePayment.status === "SUCCESS" || balancePayment.status === "PAID" || balancePayment.status === "CONFIRMED")) ||
    (order.paymentStatus === "FULLY_PAID" && hasDepositPlan && (!order.pricing?.balanceAmount || order.pricing.balanceAmount === 0)) ||
    (order.pricing?.paidAmount != null && order.pricing?.totalAmount != null && order.pricing.paidAmount >= order.pricing.totalAmount && hasDepositPlan);

  const balanceAmount =
    balancePayment?.amount ??
    order.paymentPlan?.balanceAmount ??
    order.pricing?.balanceAmount ??
    Math.max(0, (order.pricing?.totalAmount ?? 0) - (order.pricing?.paidAmount ?? 0));

  const balancePaidDate = balancePayment?.completedAt ?? balancePayment?.requestedAt;
  const balanceDueDate = order.paymentPlan?.balanceDueDate;

  const balanceDateLabel = isBalancePaid
    ? balancePaidDate
      ? `Paid on ${formatDate(balancePaidDate)}`
      : `Paid on ${formatDate(order.confirmedAt ?? order.orderDateTime)}`
    : balanceDueDate
      ? `Due by ${formatDate(balanceDueDate)}`
      : "Remaining balance";

  // If there's no deposit plan and it was a single full payment
  if (!hasDepositPlan) {
    return (
      <div className={`space-y-3 ${className}`}>
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          PAYMENT SCHEDULE
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
              <Check className="size-4 stroke-[3]" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Full Payment</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{initialDateLabel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-base font-black text-slate-900 dark:text-white tabular-nums">
              {money(order.pricing?.totalAmount ?? initialAmount)}
            </p>
            <span className="mt-0.5 inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
              PAID
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
        PAYMENT SCHEDULE
      </p>

      <div className="relative">
        {/* Step 1: Booking / Initial */}
        <div className="relative flex items-start gap-3">
          {/* Timeline node & connector line */}
          <div className="flex flex-col items-center">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
              <Check className="size-4 stroke-[3]" />
            </span>
            <div
              className={`my-1 w-0.5 flex-1 ${
                isBalancePaid
                  ? "bg-emerald-400 dark:bg-emerald-500"
                  : "bg-emerald-300/80 border-l border-dashed border-emerald-400"
              }`}
              style={{ minHeight: "1.75rem" }}
              aria-hidden
            />
          </div>

          <div className="flex flex-1 items-start justify-between gap-2 pb-2">
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Booking</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{initialDateLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums">
                {money(initialAmount)}
              </p>
              <span className="mt-0.5 inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                PAID
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Balance Payment */}
        <div className="relative flex items-start gap-3">
          {/* Timeline node */}
          <div className="flex flex-col items-center">
            {isBalancePaid ? (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                <Check className="size-4 stroke-[3]" />
              </span>
            ) : (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:border-amber-400 shadow-xs">
                <Clock className="size-3.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          <div className="flex flex-1 items-start justify-between gap-2">
            <div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Balance Payment</p>
              <p
                className={`text-xs mt-0.5 ${
                  isBalancePaid
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-amber-700 dark:text-amber-400 font-medium"
                }`}
              >
                {balanceDateLabel}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-base sm:text-lg font-black tabular-nums ${
                  isBalancePaid
                    ? "text-slate-900 dark:text-white"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {money(balanceAmount)}
              </p>
              {isBalancePaid ? (
                <span className="mt-0.5 inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                  PAID
                </span>
              ) : (
                <span className="mt-0.5 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300">
                  PENDING
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
