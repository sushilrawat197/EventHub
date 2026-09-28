import { CalendarDays, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PACKAGE_PRICE_MAX, PACKAGE_PRICE_MIN } from "../types/package";
import { formatDeparture, formatIsoDate, parseIsoDate } from "../utils/formatPackage";

type PackageFiltersPanelProps = {
  departureDate: string;
  dateOpen: boolean;
  onDateOpenChange: (open: boolean) => void;
  onDateSelect: (value: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (nextMin: number, nextMax: number) => void;
  onReset: () => void;
};

export default function PackageFiltersPanel({
  departureDate,
  dateOpen,
  onDateOpenChange,
  onDateSelect,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
}: PackageFiltersPanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-gray-900">Filters</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-2.5 py-1 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
            Departure
          </span>
          <Popover open={dateOpen} onOpenChange={onDateOpenChange}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-auto min-h-11 w-full justify-between rounded-xl border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium shadow-none hover:border-blue-200 hover:bg-white"
              >
                <span className={departureDate ? "text-gray-900" : "text-gray-700"}>
                  {departureDate ? formatDeparture(departureDate) : "Select date"}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CalendarDays className="size-3.5" />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[80] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseIsoDate(departureDate)}
                onSelect={(date) => onDateSelect(date ? formatIsoDate(date) : "")}
                className="rounded-lg border"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
            Budget
          </span>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-700">
                Min
              </p>
              <p className="text-sm font-semibold text-gray-900">
                M{minPrice.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-700">
                Max
              </p>
              <p className="text-sm font-semibold text-gray-900">
                M{maxPrice.toLocaleString()}
              </p>
            </div>
          </div>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-700">From</span>
            <input
              type="range"
              min={PACKAGE_PRICE_MIN}
              max={PACKAGE_PRICE_MAX}
              step={100}
              value={minPrice}
              onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
              className="h-1.5 w-full cursor-pointer accent-blue-600"
              aria-label="Minimum price"
            />
          </label>
          <label className="mt-3 block">
            <span className="mb-1 block text-[11px] font-semibold text-gray-700">To</span>
            <input
              type="range"
              min={PACKAGE_PRICE_MIN}
              max={PACKAGE_PRICE_MAX}
              step={100}
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-blue-600"
              aria-label="Maximum price"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
