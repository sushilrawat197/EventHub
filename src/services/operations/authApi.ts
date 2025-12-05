import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { type NavigateFunction } from "react-router-dom";
import {
  setPwdToken,
  userEmail,
  setAccessToken,
  setLoading,
  setMassage,
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
  setSignupToken,
  setOtp,
  setTempToken,
  setOtpContext,
  // setOtpContext,
} from "../../slices/authSlice";
const {
  SIGNUP_API,
  VARIFY_SIGNUP_OTP_API,
  SIGNUP_RESEND_OTP,
  SET_PASS_API,
  LOGIN_API,
  VARIFY_OTP,
  RESEND_OTP,
  CHANGE_PASSWORD,
  // VARIFY_LOGIN_OTP,
  RESET_PASSWORD,
  FORGOT_PASSWORD_OTP,
  VARIFY_RESET_PASSWORD_OTP,
  LOGOUT_API,
  FORGOT_RESEND_PASSWORD_OTP_API
} = endpoints;

import axios from "axios";
import { toast } from "react-toastify";
import { clearUser } from "../../slices/userSlice";
import { getCurrentUser } from "./userApi";
import type { AppDispatch } from "../../reducers/store";
import { listCitiesByRegion } from "./location/cityApi";
import { scheduleTokenRefresh } from "../tokenManager";


type SendOtpApiResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: {
    signupToken: string;
    setPWDTokenExpiry: string;
  };
};



// VARIFY_SIGNUP_OTP_API
export function sendOtp(
  otpString: string,
  email: string,
  signupToken: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector<SendOtpApiResponse>({
        method: "POST",
        url: VARIFY_SIGNUP_OTP_API,
        bodyData: { email, otp: otpString, signupToken },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      // console.log("SENDOTP API RESPONSE............", response);
      // console.log("PWToken", response?.data?.data?.setPWDToken);

      if (response.data.status == "SUCCESS") {
        dispatch(setSignupToken(response?.data?.data?.signupToken));
        dispatch(setOtp(otpString));
        navigate("/setpassword");
        toast.success("Verification Successfull");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error;
        dispatch(setMassage(error.response?.data?.message))
        // toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
    dispatch(setLoading(false));
  };
}


//USER SIGNUP API
export function signUp(
  email: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector<{
        success: boolean;
        message: string;
        status: string;
        data: {
          signupToken: string
        }
      }>({
        method: "POST",
        url: SIGNUP_API,
        bodyData: { email }
        // headers: {
        //   "X-Client-Source": "OTHER",
        // },
      });

      // console.log(email)

      const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);
      toast.success(data.message, { pauseOnHover: false });

      if (response.data.status == "SUCCESS") {
        // localStorage.setItem("otpContext", "signupOTP");
        // dispatch(setOtpContext("signupOTP"));
        dispatch(userEmail(email));
        dispatch(setSignupToken(response.data.data.signupToken));
        navigate("/otpverification");
        // console.log(data.message); // Optional
      }


    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        dispatch(setMassage(error.response?.data?.message));
        // toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
    dispatch(setLoading(false));
  };
}



//SIGN UP RESEND OTP
export function resendOTP(email: string) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      const response = await apiConnector<{
        success: boolean;
        message: string;
        status: string;
        data: {
          signupToken: string
        }
      }>({
        method: "POST",
        url: SIGNUP_RESEND_OTP,
        bodyData: { email },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);

      dispatch(setSignupToken(response.data.data.signupToken));

      toast.success(data.message);

      // console.log(data.message); // Optional
    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
  };
}



//SIGN UP SET PASSWORD
export function setPassword(
  password: string,
  email: string,
  otp: string,
  signupToken: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return async (): Promise<void> => {
    try {
      // console.log(otp, password, email)
      dispatch(setLoading(true));
      const response = await apiConnector<{
        message: string;
        status: string;
        data: {
          accessToken: string;
          refreshToken: string;
          accessTokenExpiry: string;
          refreshTokenExpiry: string;
          profileRequired: boolean;
        };
      }>({
        method: "POST",
        url: SET_PASS_API,
        bodyData: { email: email, otp: otp, password, signupToken },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      // const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);

      // const token=response.data.data.accessToken
      // dispatch(setAccessToken(token));
      if (response.data.status === "SUCCESS") {
        toast.success("Registration successful!");
        navigate("/login");
      }

      // console.log(data.message); // Optional
    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        // toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
    dispatch(setLoading(false));
  };
}

// FORGOT PASSWORD OTP GENERATE AND SAVE RESET TOKEN
export function forgot_passwordOtp(
  email: string,
  dispatch: AppDispatch,
  navigate: NavigateFunction
) {
  return async (): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector<{
        message: string;
        status: string;
        data: {
          resetToken: string;
        };
      }>({
        method: "POST",
        url: FORGOT_PASSWORD_OTP,
        bodyData: { email },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      // const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);

      dispatch(userEmail(email));

      const pwdToken = response.data.data.resetToken;
      dispatch(setPwdToken(pwdToken));


      toast.success("OTP sent successfully");
      // console.log(data.message); // Optional

      navigate("/verifyforgototp");
    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
    dispatch(setLoading(false));
  };
}


//VERIFY FORGOT OTP
export function varifyFogotOtp(
  resetToken: string,
  otp: string,
  dispatch: AppDispatch,
  navigate: NavigateFunction
) {
  return async (): Promise<void> => {
    try {

      const response = await apiConnector<{
        message: string;
        status: string;
        statusCode: number;
        data: {
          accessToken: string;
        };
      }>({
        method: "POST",
        url: VARIFY_RESET_PASSWORD_OTP,
        bodyData: { resetToken, otp },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      if (response.data.statusCode === 200) {
        dispatch(setOtp(otp));
        toast.success("OTP verificaion Successfull");
        navigate("/passwordreset");
      }
      // const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);



    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
  };
}

//RESEND FORGOT OTP
export function forgotp_password_resend_OTP(resetToken: string) {
  return async (): Promise<void> => {
    try {
      const response = await apiConnector<{
        success: boolean;
        message: string;
        status: string;
      }>({
        method: "POST",
        url: FORGOT_RESEND_PASSWORD_OTP_API, //IT WAS RESEND OTP BEFORE
        bodyData: { resetToken },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);

      toast.success(data.message);

      // console.log(data.message); // Optional
    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
  };
}

//RESET FORGOT PASSWORD
export function resetPassword(
  token: string,
  otp: string,
  password: string,
  navigate: NavigateFunction
) {
  return async (): Promise<void> => {
    // dispatch(setLoading(true));
    // console.log("OTP...", otp)
    try {
      const response = await apiConnector<{
        message: string;
        status: string;
        data: {
          setPWDToken: string;
        };
      }>({
        method: "POST",
        url: RESET_PASSWORD,
        bodyData: {
          resetToken: token,
          otp,
          newPassword: password,
        },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);

      // const pwdToken= response.data.data.setPWDToken;
      // dispatch(setPwdToken(pwdToken));
      if (data.status === "SUCCESS") {
        toast.success("Password changed successfully");
      }

      // console.log(data.message); // Optional
      navigate("/passwordresetsuccess");
    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
    // dispatch(setLoading(false));
  };
}

// PASSWORD EXPIRED NOW CHANGE IT 
export function changePassword(
  pwdChangeToken: string,
  oldPassword: string,
  newPassword: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    // dispatch(setLoading(true));

    try {
      const response = await apiConnector<{
        message: string;
        status: string;
        data: {
          setPWDToken: string;
        };
      }>({
        method: "POST",
        url: CHANGE_PASSWORD,
        bodyData: {
          pwdChangeToken,
          oldPassword,
          newPassword
        },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      // console.log("SIGNUP API RESPONSE............", data);

      // const pwdToken= response.data.data.setPWDToken;
      // dispatch(setPwdToken(pwdToken));
      if (data.status === "SUCCESS") {
        dispatch(setMassage(response.data.message));
        toast.success("Password changed successfully");
      }

      // console.log(data.message); // Optional
      navigate("/login");
    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error;
        dispatch(setMassage(error.response?.data?.data?.resetToken));
        // toast.error(error.response?.data?.message);
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
      } else {
        console.log(
          "SIGNUP API ERROR............",
          "An unknown error occurred."
        );
      }
    }
    // dispatch(setLoading(false));
  };
}


//SING IN 
export function signIn(
  email: string,
  password: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch,
  from: string // 👈 yeh add kiya
) {
  return async (): Promise<void> => {
    try {
      dispatch(setLoading(true));

      const response = await apiConnector<{
        message: string;
        statusCode: number;
        data: {
          accessTokenExpiry: string;
          refreshTokenExpiry: string;
          tempToken?: string; // ✅ tempToken optional
          pwdChangeToken?: string; // ✅ tempToken optional
        };
      }>({
        method: "POST",
        url: LOGIN_API,
        bodyData: {
          email,
          password,
        },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      const data = response.data;
      // console.log("LOGIN API RESPONSE............", data);

      const { refreshTokenExpiry, tempToken, pwdChangeToken } = data.data;

      // const aceessTokenExpirTime = new Date(accessTokenExpiry);
      // const refrehTokenExpirTime = new Date(refreshTokenExpiry);
      // const now = new Date();

      // console.log("current time : ", now.toLocaleTimeString())
      // console.log("accessTokenExpiry Time :", aceessTokenExpirTime.toLocaleTimeString());
      // console.log("refreshTokenExpiry Time :", refrehTokenExpirTime.toLocaleTimeString());

      
      if (data.statusCode === 200) {
        
      await  dispatch(getCurrentUser());
         const accessTokenExpiry = response.data.data.refreshTokenExpiry;
        if (accessTokenExpiry) {
          dispatch(scheduleTokenRefresh(accessTokenExpiry));
        }

        localStorage.setItem("accessTokenExpiry", accessTokenExpiry);
        localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry);

        dispatch(setAccessTokenExpiry(accessTokenExpiry));
        dispatch(setRefreshTokenExpiry(refreshTokenExpiry));
        dispatch(listCitiesByRegion());

        if (tempToken) {
          // ✅ 2FA user → navigate to OTP verify page
          dispatch(setTempToken(tempToken)) // store tempToken for OTP verification
          dispatch(setOtpContext("2FA"))
          navigate("/otpverification");
        } else if (pwdChangeToken) {
          navigate("/change-password");
          dispatch(setPwdToken(pwdChangeToken));
        } else {
          // ✅ Normal user → navigate to home
          dispatch(setOtpContext("signup"))
          if (from) {
            localStorage.setItem("dairectnavigate", "singleD&T");
            navigate(from, { replace: true });

          } else {
            navigate("/");
          }


        }
      } else if (data.statusCode === 409) {
        navigate("/forgetpassword")
        dispatch(setMassage(response.data.message));
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setMassage(error.response?.data?.message || "Login failed"));
        console.log("LOGIN API ERROR RESPONSE............", error);
      } else {
        console.log("LOGIN ERROR............", "An unknown error occurred.");
        toast.error("Something went wrong");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
}


export function verify_2fa_otp(
  tempToken: string,
  otp: string,
  navigate: NavigateFunction,
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      // dispatch(setLoading(true));

      const response = await apiConnector<{
        message: string;
        statusCode: number;
        data: {
          tempToken?: string; // ✅ tempToken optional
        };
      }>({
        method: "POST",
        url: VARIFY_OTP,
        bodyData: {
          tempToken,
          otp,
        },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // const data = response.data;
      // console.log("2FA VARIFY OTP API RESPONSE............", data);

      if (response.data.statusCode === 200) {
        dispatch(getCurrentUser());
        navigate("/");
      }



    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setMassage(error.response?.data?.message || "Login failed"));
        console.log("2FA VARIFY OTP API RESPONSE............", error);
      } else {
        console.log("2FA VARIFY ERROR............", "An unknown error occurred.");
        toast.error("Something went wrong");
      }
    } finally {
      // dispatch(setLoading(false));
    }
  };
}

export function resend_2fa_otp(
  tempToken: string,
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      // dispatch(setLoading(true));

      const response = await apiConnector<{
        message: string;
        statusCode: number;
        data: {
          tempToken?: string; // ✅ tempToken optional
        };
      }>({
        method: "POST",
        url: RESEND_OTP,
        bodyData: {
          tempToken,
        },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // const data = response.data;
      // console.log("2FA VARIFY OTP API RESPONSE............", data);

      if (response.data.statusCode === 200) {
        toast.success(response.data.message);
      }


    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setMassage(error.response?.data?.message || "Login failed"));
        console.log("2FA VARIFY OTP API RESPONSE............", error);
      } else {
        console.log("2FA VARIFY ERROR............", "An unknown error occurred.");
        toast.error("Something went wrong");
      }
    } finally {
      // dispatch(setLoading(false));
    }
  };
}


//LOGOUT
export function logout(
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return async (): Promise<void> => {
    try {
      // Make logout API call if needed
      dispatch(setLoading(true))
      const response = await apiConnector({
        method: "POST",
        url: LOGOUT_API, // ✅ Use the correct endpoint
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",

        },
      });

      console.log(response);
      // ✅ Remove token and other sensitive data from localStorage/cookies
      localStorage.removeItem("accessToken"); // or your actual key
      // localStorage.removeItem("refreshToken"); // or your actual key
      localStorage.removeItem("accessTokenExpiry"); // or your actual key
      dispatch(setAccessToken(null)); // if you're storing user data
      dispatch(setAccessTokenExpiry(""));
      dispatch(setTempToken(""));
      dispatch(setOtpContext(""));
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout Error:", error.response?.data?.message);
      } else {
        console.error("Unexpected Logout Error:", error);
      }
    } finally {
      dispatch(setLoading(false))
    }
  };
}

