"use client";

export default function ForgotPasswordConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <div className="mb-4">
          <img
            src="ticketlogo2.jpg"
            alt="ticket logo"
            className="h-[2.2rem] mx-auto mb-4"
          />
        </div>

        <h2 className="text-2xl font-semibold text-black mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-[#777777] mb-6">
          Please check your email. Instructions for resetting your password have
          been sent there.
        </p>

        <button
          type="button"
          className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
