import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FilterItem } from "./FilterItem";
import {
  CATEGORY_OPTIONS,
  DATE_OPTIONS,
  LANGUAGE_OPTIONS,
  PRICE_OPTIONS,
} from "../utils/filterOptions";

export default function FilterPanel() {
  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  const categoryOptions = [...CATEGORY_OPTIONS];
  const dateOptions = [...DATE_OPTIONS];
  const languageOptions = [...LANGUAGE_OPTIONS];
  const priceOptions = [...PRICE_OPTIONS];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
          </div>

          <div className="space-y-4">
            <FilterItem title="Date" options={dateOptions} filterKey="dates" />
            <FilterItem
              title="Languages"
              options={languageOptions}
              filterKey="languages"
            />
            <FilterItem
              title="Categories"
              options={categoryOptions}
              filterKey="categories"
            />
            <FilterItem
              title="Price"
              options={priceOptions}
              filterKey="prices"
            />
          </div>
        </div>

        {/* Featured Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h3
              className="text-base font-semibold tracking-tight text-slate-900"
              style={{
                fontFamily: "var(--font-outfit), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              Featured
            </h3>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
              Quick picks
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-sm">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  Trending Events
                </div>
                <div className="text-xs text-slate-500">
                  Most popular this week
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-sm">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  Last Minute
                </div>
                <div className="text-xs text-slate-500">
                  Events starting soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        {openMobileFilters && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setOpenMobileFilters(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            openMobileFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Filters</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenMobileFilters(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto h-full">
            <FilterItem title="Date" options={dateOptions} filterKey="dates" />
            <FilterItem
              title="Languages"
              options={languageOptions}
              filterKey="languages"
            />
            <FilterItem
              title="Categories"
              options={categoryOptions}
              filterKey="categories"
            />
            <FilterItem
              title="Price"
              options={priceOptions}
              filterKey="prices"
            />
          </div>
        </div>
      </div>
    </>
  );
}
