import { useState, type ReactNode } from "react";
import { CalendarClock, ChevronDown, CircleDollarSign, FileText, Info, Receipt, Wallet } from "lucide-react";
import type { PackageCancellationPolicy, PackageCancellationRule, PackagePaymentTerms } from "../../types/packageDetail";
import { clean, formatDate, formatMoney, friendlyLabel, plural } from "../../utils/packageDetailFormat";
import { paymentIcon } from "../../utils/packageDetailIcons";
import { RefundBadge } from "./PackageBookingCard";
import { Badge, DetailSection } from "./primitives";

function TermRow({ label, children }: { label: string; children?: ReactNode }) {
  if (children == null || children === "" || children === false) return null;
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 sm:text-right dark:text-slate-100">{children}</dd>
    </div>
  );
}

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

  return (
    <div>
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
        <Wallet className="size-4 text-blue-600 dark:text-blue-300" aria-hidden />
        Payment terms
      </h3>
      <dl className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
        <TermRow label="Deposit">{depositText(terms)}</TermRow>
        <TermRow label="Initial payment">{initial}</TermRow>
        <TermRow label="Refundability">
          {terms.refundability ? <RefundBadge refundability={terms.refundability} /> : undefined}
        </TermRow>
        <TermRow label="Balance due">{balanceDue}</TermRow>
        <TermRow label="Payment deadline">{formatDate(terms.paymentDeadline) ?? clean(terms.paymentDeadline)}</TermRow>
        <TermRow label="Accepted methods">
          {methods.length ? (
            <ul className="flex flex-wrap gap-1.5 sm:justify-end">
              {methods.map((method) => {
                const Icon = paymentIcon(method);
                return (
                  <li
                    key={method}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {friendlyLabel(method)}
                  </li>
                );
              })}
            </ul>
          ) : undefined}
        </TermRow>
      </dl>
      {instructions ? (
        <p className="mt-3 flex gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          <Receipt className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
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
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <CalendarClock className="size-4 text-blue-600 dark:text-blue-300" aria-hidden />
          Cancellation policy
        </h3>
        {policyType ? <Badge tone="blue">{policyType}</Badge> : null}
      </div>
      {rules.length ? (
        <ol className="mt-3 space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="flex gap-3 rounded-xl border border-slate-200/80 p-3 dark:border-slate-800">
              <CircleDollarSign className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
              <div className="text-sm">
                {rule.when || rule.outcome ? (
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {[rule.when, rule.outcome].filter(Boolean).join(": ")}
                  </p>
                ) : null}
                {rule.note ? <p className="text-slate-600 dark:text-slate-300">{rule.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
          <Info className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
          Cancellation rules not specified. Please contact the operator.
        </p>
      )}
    </div>
  );
}

function Accordion({
  open,
  onToggle,
  icon,
  title,
  summary,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-neutral-50 sm:p-5 dark:hover:bg-slate-800/60"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-lg dark:border-slate-700 dark:bg-slate-800">
            {icon}
          </span>
          <span>
            <strong className="block text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">{title}</strong>
            <span className="block text-xs font-normal text-neutral-500 dark:text-slate-400">{summary}</span>
          </span>
        </span>
        <ChevronDown className={`size-4 text-neutral-600 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? <div className="package-fade-in border-t border-neutral-100 px-5 pb-6 pt-4 dark:border-slate-800">{children}</div> : null}
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
          icon="💳"
          title="Payment terms & accepted methods"
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
          icon="🛡️"
          title="Cancellation & refund policy"
          summary={policyType ?? "Review the schedule before you book"}
        >
          <Cancellation policy={cancellationPolicy} />
        </Accordion>
      </div>
    </DetailSection>
  );
}
