import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function ForgotPasswordConfirmation() {
  return (
    <div className="flex min-h-[calc(100dvh-4.5rem)] items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-7rem)]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400" aria-hidden />

        <div className="px-8 py-10 text-center sm:px-10 sm:py-12">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <Check className="size-8 stroke-[2.75]" aria-hidden />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Success
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Password updated
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600 sm:text-base">
            Your password has been reset successfully. Sign in with your new password to continue.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
