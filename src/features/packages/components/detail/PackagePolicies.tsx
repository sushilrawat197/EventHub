import { useState, type ReactNode } from "react";
import { CalendarClock, ChevronDown, FileText, Info, Receipt, Wallet, type LucideIcon } from "lucide-react";
import type { PackageCancellationPolicy, PackageCancellationRule, PackagePaymentTerms } from "../../types/packageDetail";
import { clean, formatDate, formatMoney, friendlyLabel, plural } from "../../utils/packageDetailFormat";
import { paymentIcon } from "../../utils/packageDetailIcons";
import { RefundBadge } from "./PackageBookingCard";
import { Badge, DetailSection } from "./primitives";

function depositText(terms: PackagePaymentTerms): string | undefined {
  const type = terms.depositType?.toUpperCase();
  if (type === "NONE") return "No deposit required";
  if (terms.depositAmount != null) {
    if (terms.calculationType?.toUpperCase() === "PERCENTAGE") return `${terms.depositAmount}%`;
    return formatMoney(terms.depositAmount, terms.currency);
  }
  return friendlyLabel(terms.depositType);
}

function PaymentTerms({ terms }: { terms: PackagePaymentTerms }) {
  const methods = (terms.paymentMethods ?? []).map((method) => method.trim()).filter(Boolean);
  const initial = terms.initialPaymentType?.toUpperCase() === "NONE" ? undefined : friendlyLabel(terms.initialPaymentType);
  const balanceDue = formatDate(terms.balanceDueDate) ?? friendlyLabel(terms.balanceDueAt);
  const instructions = clean(terms.paymentInstructions);
  const facts = [
    { label: "Deposit", value: depositText(terms) },
    { label: "Initial payment", value: initial },
    { label: "Balance due", value: balanceDue },
    { label: "Payment deadline", value: formatDate(terms.paymentDeadline) ?? clean(terms.paymentDeadline) },
  ].filter((fact) => fact.value);

  return (
    <div className="space-y-4">
      {facts.length ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/70">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{fact.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {terms.refundability ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/70">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Refundability</span>
          <RefundBadge refundability={terms.refundability} />
        </div>
      ) : null}
      {methods.length ? (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Accepted methods</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {methods.map((method) => {
              const Icon = paymentIcon(method);
              return (
                <li
                  key={method}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Icon className="size-3.5 text-blue-600 dark:text-blue-300" aria-hidden />
                  {friendlyLabel(method)}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {instructions ? (
        <p className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-sm leading-relaxed text-slate-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-slate-200">
          <Receipt className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden />
          {instructions}
        </p>
      ) : null}
    </div>
  );
}

function ruleText(rule: PackageCancellationRule): { when?: string; outcome?: string; note?: string } {
  const when = rule.daysBeforeDeparture != null ? `${plural(rule.daysBeforeDeparture, "day")} before departure` : undefined;
  const outcome =
    rule.refundPercentage != null
      ? `${rule.refundPercentage}% refund`
      : rule.chargePercentage != null
        ? `${rule.chargePercentage}% cancellation charge`
        : undefined;
  return { when, outcome, note: clean(rule.description) };
}

function Cancellation({ policy }: { policy: PackageCancellationPolicy | null }) {
  const rules = (policy?.rules ?? [])
    .map(ruleText)
    .filter((rule) => rule.when || rule.outcome || rule.note);
  const policyType = friendlyLabel(policy?.policyType);

  return (
    <div className="space-y-3">
      {policyType ? <Badge tone="blue">{policyType}</Badge> : null}
      {rules.length ? (
        <ol className="space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              {rule.when || rule.outcome ? (
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {[rule.when, rule.outcome].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              {rule.note ? <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{rule.note}</p> : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          <Info className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
          Cancellation rules are shared by the operator before you confirm.
        </p>
      )}
    </div>
  );
}

function Accordion({
  open,
  onToggle,
  icon: Icon,
  tone,
  title,
  summary,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: LucideIcon;
  tone: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
            <Icon className="size-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <strong className="block text-sm font-semibold text-slate-950 sm:text-base dark:text-white">{title}</strong>
            <span className="mt-0.5 block truncate text-xs font-normal text-slate-500 dark:text-slate-400">{summary}</span>
          </span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          <ChevronDown className={`size-4 transition-transform duration-300 ${open ? "rotate-180 text-blue-600" : ""}`} aria-hidden />
        </span>
      </button>
      {open ? <div className="border-t border-slate-100 px-4 pb-4 pt-4 dark:border-slate-800">{children}</div> : null}
    </article>
  );
}

export default function PackagePolicies({
  paymentTerms,
  cancellationPolicy,
}: {
  paymentTerms: PackagePaymentTerms | null;
  cancellationPolicy: PackageCancellationPolicy | null;
}) {
  const [openSection, setOpenSection] = useState<"payment" | "cancellation" | null>("payment");
  const deposit = paymentTerms ? depositText(paymentTerms) : undefined;
  const policyType = friendlyLabel(cancellationPolicy?.policyType);

  return (
    <DetailSection
      id="policies"
      eyebrow="Booking confidence"
      eyebrowTone="blue"
      meta="Terms & protection"
      title="Payment terms & cancellation policy"
    >
      <div className="space-y-4">
        <Accordion
          open={openSection === "payment"}
          onToggle={() => setOpenSection(openSection === "payment" ? null : "payment")}
          icon={Wallet}
          tone="bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
          title="Payment terms"
          summary={deposit ?? "Shared by the operator at booking"}
        >
          {paymentTerms ? (
            <PaymentTerms terms={paymentTerms} />
          ) : (
            <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <FileText className="size-4" aria-hidden />
              Payment terms are shared by the operator at booking.
            </p>
          )}
        </Accordion>
        <Accordion
          open={openSection === "cancellation"}
          onToggle={() => setOpenSection(openSection === "cancellation" ? null : "cancellation")}
          icon={CalendarClock}
          tone="bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"
          title="Cancellation & refund policy"
          summary={policyType ?? "Review the schedule before you book"}
        >
          <Cancellation policy={cancellationPolicy} />
        </Accordion>
      </div>
    </DetailSection>
  );
}
