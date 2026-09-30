import { UserRound } from "lucide-react";
import { Badge, SectionCard } from "../detail/primitives";
import { TITLES, type GuestErrors, type GuestForm, type GuestSlot } from "../../utils/packageReservation";
import { inputClass } from "./inputClass";
import { Field } from "./reviewPrimitives";

function GuestCard({
  slot,
  value,
  errors,
  onChange,
}: {
  slot: GuestSlot;
  value: GuestForm;
  errors: GuestErrors;
  onChange: (patch: Partial<GuestForm>) => void;
}) {
  const isChild = slot.type === "CHILD";
  const id = (field: string) => `guest-${slot.key}-${field}`;
  const describedBy = (field: keyof GuestForm) => (errors[field] ? `${id(field)}-error` : undefined);
  const contactHint = slot.primary ? undefined : "Optional. The lead guest's contact is used if left blank.";

  return (
    <fieldset className="rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700" data-guest={slot.key}>
      <legend className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-900 dark:text-white">
        {slot.label}
        {slot.age != null ? <span className="font-normal text-slate-500 dark:text-slate-400">· {slot.age} yrs</span> : null}
        {slot.primary ? (
          <Badge tone="blue">Lead guest</Badge>
        ) : isChild ? (
          <span className="text-xs font-normal text-slate-400">(Optional)</span>
        ) : null}
      </legend>

      <div className="mt-2 grid gap-4 sm:grid-cols-[120px_1fr_1fr]">
        <Field id={id("title")} label="Title" error={errors.title} required={!isChild}>
          <select
            id={id("title")}
            value={value.title}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={describedBy("title")}
            onChange={(event) => onChange({ title: event.target.value })}
            className={inputClass(Boolean(errors.title))}
          >
            <option value="" disabled={!isChild}>
              Select
            </option>
            {TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("firstName")} label="First name" error={errors.firstName} required={!isChild}>
          <input
            id={id("firstName")}
            value={value.firstName}
            autoComplete={slot.primary ? "given-name" : "off"}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy("firstName")}
            onChange={(event) => onChange({ firstName: event.target.value })}
            className={inputClass(Boolean(errors.firstName))}
            placeholder={isChild ? "Optional" : undefined}
          />
        </Field>
        <Field id={id("lastName")} label="Last name" error={errors.lastName} required={!isChild}>
          <input
            id={id("lastName")}
            value={value.lastName}
            autoComplete={slot.primary ? "family-name" : "off"}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy("lastName")}
            onChange={(event) => onChange({ lastName: event.target.value })}
            className={inputClass(Boolean(errors.lastName))}
            placeholder={isChild ? "Optional" : undefined}
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field id={id("email")} label="Email" error={errors.email} hint={contactHint} required={slot.primary}>
          <input
            id={id("email")}
            type="email"
            inputMode="email"
            value={value.email}
            autoComplete={slot.primary ? "email" : "off"}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            onChange={(event) => onChange({ email: event.target.value })}
            className={inputClass(Boolean(errors.email))}
          />
        </Field>
        <Field
          id={id("mobileNumber")}
          label="Mobile number"
          error={errors.mobileCountryCode ?? errors.mobileNumber}
          hint={contactHint}
          required={slot.primary}
        >
          <div
            className={`flex h-11 w-full overflow-hidden rounded-xl border bg-white transition focus-within:ring-2 dark:bg-slate-900 ${
              errors.mobileCountryCode || errors.mobileNumber
                ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/20"
                : "border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/20 dark:border-slate-700"
            }`}
          >
            <input
              aria-label="Country code"
              type="text"
              placeholder="+266"
              value={value.mobileCountryCode}
              aria-invalid={Boolean(errors.mobileCountryCode)}
              onChange={(event) => {
                let code = event.target.value.replace(/[^\d+]/g, "").slice(0, 5);
                if (code && !code.startsWith("+")) code = `+${code}`;
                onChange({ mobileCountryCode: code });
              }}
              className="w-20 shrink-0 border-r border-slate-200 bg-slate-50/60 px-2.5 text-center text-sm font-semibold text-slate-800 outline-none transition focus:bg-white dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:bg-slate-900"
            />
            <input
              id={id("mobileNumber")}
              type="tel"
              inputMode="numeric"
              placeholder="e.g. 50000000"
              value={value.mobileNumber}
              autoComplete={slot.primary ? "tel-national" : "off"}
              aria-invalid={Boolean(errors.mobileNumber)}
              aria-describedby={describedBy("mobileNumber")}
              onChange={(event) => onChange({ mobileNumber: event.target.value.replace(/\D/g, "").slice(0, 15) })}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>
        </Field>
      </div>
    </fieldset>
  );
}

export default function GuestDetailsForm({
  slots,
  guests,
  errors,
  onChange,
}: {
  slots: GuestSlot[];
  guests: Record<string, GuestForm>;
  errors: Record<string, GuestErrors>;
  onChange: (key: string, patch: Partial<GuestForm>) => void;
}) {
  if (!slots.length) return null;
  return (
    <SectionCard id="guests" title="Guest details" icon={UserRound}>
      <p className="-mt-2 mb-4 text-sm text-slate-500 dark:text-slate-400">
        Enter adult names as they appear on their ID. Child details are optional.
      </p>
      <div className="space-y-4">
        {slots.map((slot) => (
          <GuestCard
            key={slot.key}
            slot={slot}
            value={guests[slot.key]}
            errors={errors[slot.key] ?? {}}
            onChange={(patch) => onChange(slot.key, patch)}
          />
        ))}
      </div>
    </SectionCard>
  );
}
