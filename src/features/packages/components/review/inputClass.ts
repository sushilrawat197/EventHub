export const inputClass = (invalid?: boolean) =>
  `h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
    invalid
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
  }`;
