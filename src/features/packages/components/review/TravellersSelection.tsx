import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAgeRange } from "../../utils/packageDetailFormat";
import { ageChoices, MAX_PER_TYPE, type TravellerOption } from "../../utils/packageReservation";
import { SectionCard } from "../detail/primitives";
import { inputClass } from "./inputClass";
import { Field, Stepper } from "./reviewPrimitives";

export default function TravellersSelection({
  options,
  counts,
  ages,
  seatsLeft,
  ageErrors,
  onCount,
  onAge,
  locked = false,
}: {
  options: TravellerOption[];
  counts: Record<string, number>;
  ages: Record<string, number[]>;
  seatsLeft?: number;
  ageErrors: Record<string, string>;
  onCount: (type: string, value: number) => void;
  onAge: (type: string, index: number, age: number) => void;
  locked?: boolean;
}) {
  const seated = options.filter((option) => option.type !== "INFANT").reduce((sum, option) => sum + (counts[option.type] ?? 0), 0);

  return (
    <SectionCard id="travellers" title="Travellers" icon={Users}>
      {locked ? (
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Traveller counts were set on the package page and stay fixed for this reservation.
        </p>
      ) : null}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {options.map((option) => {
          const count = counts[option.type] ?? 0;
          const age = formatAgeRange(option.minAge, option.maxAge);
          const seatLimit = seatsLeft != null && option.type !== "INFANT" ? count + Math.max(0, seatsLeft - seated) : MAX_PER_TYPE;
          const choices = ageChoices(option);
          return (
            <li key={option.type} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {option.label}
                    {age ? <span className="ml-1.5 text-xs font-normal text-slate-500 dark:text-slate-400">({age})</span> : null}
                  </p>
                  {option.needsAge ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Age is required{option.type === "INFANT" ? ". Guest details are not required" : ""}
                    </p>
                  ) : null}
                </div>
                {locked ? (
                  <span className="min-w-6 text-center text-base font-semibold tabular-nums text-slate-900 dark:text-white" aria-label={`${count} ${option.label}`}>
                    {count}
                  </span>
                ) : (
                  <Stepper
                    label={option.label}
                    value={count}
                    min={option.min}
                    max={Math.min(MAX_PER_TYPE, seatLimit)}
                    onChange={(value) => onCount(option.type, value)}
                  />
                )}
              </div>

              {option.needsAge && count > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: count }, (_, index) => {
                    const id = `age-${option.type}-${index}`;
                    const value = ages[option.type]?.[index];
                    const error = ageErrors[`${option.type}-${index}`];
                    return (
                      <Field key={id} id={id} label={`${option.label} ${index + 1} age`} error={error} required>
                        <Select
                          value={value != null ? String(value) : ""}
                          onValueChange={(selectedAge) => onAge(option.type, index, Number(selectedAge))}
                        >
                          <SelectTrigger
                            id={id}
                            aria-invalid={Boolean(error)}
                            className={inputClass(Boolean(error))}
                          >
                            <SelectValue placeholder="Age" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="z-50 max-h-60 min-w-[8.5rem]">
                            {choices.map((choice) => (
                              <SelectItem key={choice} value={String(choice)} className="cursor-pointer py-2 px-3 text-sm font-medium">
                                {choice} {choice === 1 ? "year" : "years"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  })}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {seatsLeft != null ? (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {seatsLeft} {seatsLeft === 1 ? "seat" : "seats"} left on this departure.
        </p>
      ) : null}
    </SectionCard>
  );
}
