import { buildApiUrl, buildTicketcoreUrl } from "@/lib/api/buildUrl";

export const authEndpoints = {
  signup: {
    init: () => buildApiUrl("TICKETCORE", "/auth/signup/init"),
    verifyOtp: () => buildApiUrl("TICKETCORE", "/auth/signup/verify-otp"),
    complete: () => buildApiUrl("TICKETCORE", "/auth/signup/complete"),
  },
  login: () => buildApiUrl("TICKETCORE", "/auth/login"),
  verifyOtp: () => buildApiUrl("TICKETCORE", "/auth/verify-otp"),
  resendOtp: () => buildApiUrl("TICKETCORE", "/auth/resend-otp"),
  changePassword: () => buildApiUrl("TICKETCORE", "/auth/change-password"),
  forgotPassword: () => buildApiUrl("TICKETCORE", "/auth/forgot-password"),
  verifyResetOtp: () => buildApiUrl("TICKETCORE", "/auth/verify-reset-otp"),
  resetPassword: () => buildApiUrl("TICKETCORE", "/auth/reset-password"),
  resendPasswordResetOtp: () =>
    buildApiUrl("TICKETCORE", "/auth/resend-password-reset-otp"),
  logout: () => buildApiUrl("TICKETCORE", "/auth/logout"),
  refresh: () => buildApiUrl("TICKETCORE", "/auth/refreshToken"),
  googleOAuth: () => buildTicketcoreUrl("/oauth2/authorization/google"),
} as const;
