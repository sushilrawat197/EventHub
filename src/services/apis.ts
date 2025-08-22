// const BASE_URL: string = "https://thedemonstrate.com/GenericAuthService/";


const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;
// console.log('BASE URL; ', BASE_URL);
// AUTH ENDPOINTS

export const endpoints = {
  VARIFY_SIGNUP_OTP_API: BASE_URL + "api/v1/auth/verifysignupotp",
  SIGNUP_RESEND_OTP: BASE_URL + "api/v1/auth/signup-resendotp",
  SIGNUP_API: BASE_URL + "api/v1/auth/signup",
  SET_PASS_API:BASE_URL + "api/v1/auth/sewtpwd",
  LOGIN_API:BASE_URL + "api/v1/auth/login",
  VARIFY_LOGIN_OTP:BASE_URL + "api/v1/auth/verify-otp",
  FORGOT_PASSWORD_OTP:BASE_URL + "api/v1/auth/forgot-passwordOtp",
  RESET_PASSWORD:BASE_URL + "api/v1/auth/verify-forgot-passwordOtp",
  LOGOUT_API:BASE_URL + "api/v1/auth/logout",
  FORGOT_RESEND_PASSWORD_OTP_API :BASE_URL +"api/v1/auth/resend-forgot-passwordOtp",
  REFRESH_ACCESS_TOKEN:BASE_URL+"api/v1/auth/refreshToken"
}


export const userEndpoint={
  GET_USER_API:BASE_URL + "api/v1/users/get-userprofile",
  UPDATE_USER_API:BASE_URL + "api/v1/users/save-updateuserprofile",
  UPDATE_USER_IMAGE_API:BASE_URL + "api/v1/users/upload-profilepicture"
}


export const eventsEndpoint={
  GET_EVENTS_API: "https://thedemonstrate.com/CMS/api/v1/contents?city=Mumbai",
}


