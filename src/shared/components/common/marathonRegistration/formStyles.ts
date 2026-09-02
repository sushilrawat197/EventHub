export const baseInputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 " +
  "[&:-webkit-autofill]:[-webkit-text-fill-color:#111827] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#f9fafb_inset] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#f9fafb_inset] " +
  "[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_#f9fafb_inset] [&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#f9fafb_inset] " +
  "[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_#ffffff_inset] [&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#ffffff_inset]";

export const inputRing = (err?: string) =>
  err ? "border-red-400 focus:ring-red-400" : "focus:border-blue-500 focus:ring-blue-500/20";

export const baseLabelClass = "mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600";
