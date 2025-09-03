// const BASE_URL: string = "https://thedemonstrate.com/GenericAuthService/";


const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;
// console.log('BASE URL; ', BASE_URL);
// AUTH ENDPOINTS

export const endpoints = {
  VARIFY_SIGNUP_OTP_API: BASE_URL + "/ticketcore-api/api/v1/auth/signup/verify-otp",
  SIGNUP_RESEND_OTP: BASE_URL + "/ticketcore-api/api/v1/auth/signup/init",
  SIGNUP_API: BASE_URL + "/ticketcore-api/api/v1/auth/signup/init",
  SET_PASS_API:BASE_URL + "/ticketcore-api/api/v1/auth/signup/complete",


  //login
  LOGIN_API:BASE_URL + "/ticketcore-api/api/v1/auth/login",

  //2FA
  VARIFY_OTP:BASE_URL + "/ticketcore-api/api/v1/auth/verify-otp",
  RESEND_OTP:BASE_URL + "/ticketcore-api/api/v1/auth/resend-otp",


  CHANGE_PASSWORD:BASE_URL + "/ticketcore-api/api/v1/auth/change-password",


  
  //FORGOT PASSWORD
  FORGOT_PASSWORD_OTP:BASE_URL + "/ticketcore-api/api/v1/auth/forgot-password",
  VARIFY_RESET_PASSWORD_OTP:BASE_URL + "/ticketcore-api/api/v1/auth/verify-reset-otp",
  RESET_PASSWORD:BASE_URL + "/ticketcore-api/api/v1/auth/reset-password",
  FORGOT_RESEND_PASSWORD_OTP_API :BASE_URL +"/ticketcore-api/api/v1/auth/resend-password-reset-otp",


  //LOGOUT AND REFRESH 
  LOGOUT_API:BASE_URL + "/ticketcore-api/api/v1/auth/logout",
  REFRESH_ACCESS_TOKEN:BASE_URL+"/ticketcore-api/api/v1/auth/refreshToken"
}


export const userEndpoint={
  GET_USER_API:BASE_URL + "/ticketcore-api/api/v1/users/me/profile",
  UPDATE_USER_API:BASE_URL + "/ticketcore-api/api/v1/users/me/profile",
  UPDATE_USER_IMAGE_API:BASE_URL + "/ticketcore-api/api/v1/users/me/picture"
}


export const eventsEndpoint={
  GET_EVENTS_API: "https://thedemonstrate.com/CMS/api/v1/contents?city=Mumbai",
}


