const BASE_URL: string = "https://thedemonstrate.com/GenericAuthService/";


// AUTH ENDPOINTS
export const endpoints = {
  SEND_OTP_API: BASE_URL + "api/v1/auth/verifysignupotp",
  RESEND_OTP: BASE_URL + "api/v1/auth/signup-resendotp",
  SIGNUP_API: BASE_URL + "api/v1/auth/signup",
  SET_PASS_API:BASE_URL + "api/v1/auth/sewtpwd",
  LOGIN_API:BASE_URL + "api/v1/auth/login",
  VARIFY_LOGIN_OTP:BASE_URL + "api/v1/auth/verify-otp"
}


