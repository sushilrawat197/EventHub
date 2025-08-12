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
  // setOtpContext,
} from "../../slices/authSlice";
const {
  SIGNUP_API,
  VARIFY_SIGNUP_OTP_API,
  SIGNUP_RESEND_OTP,
  SET_PASS_API,
  LOGIN_API,
  // VARIFY_LOGIN_OTP,
  FORGOT_PASSWORD_OTP,
  RESET_PASSWORD,
  LOGOUT_API,
  FORGOT_RESEND_PASSWORD_OTP_API
} = endpoints;

import axios from "axios";
// import { toast } from "react-hot-toast"
import { toast } from "react-toastify";
// import { stopAutoTokenRefresh } from "../../token/getNewAccessToken";
import { clearUser } from "../../slices/userSlice";
import { getCurrentUser } from "./userApi";
import type { AppDispatch} from "../../reducers/store";
// import { startAutoTokenRefresh } from "../../token/getNewAccessToken";


type SendOtpApiResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: {
    setPWDToken: string;
    setPWDTokenExpiry: string;
  };
};


// VARIFY_SIGNUP_OTP_API
export function sendOtp(
  otpString: string,
  email: string,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector<SendOtpApiResponse>({
        method: "POST",
        url: VARIFY_SIGNUP_OTP_API,
        bodyData: { emailOrMsisdn: email, otp: otpString },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      console.log("SENDOTP API RESPONSE............", response);
      // console.log("PWToken", response?.data?.data?.setPWDToken);

      if (response.data.status == "SUCCESS") {
        dispatch(setPwdToken(response?.data?.data?.setPWDToken));
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
      }>({
        method: "POST",
        url: SIGNUP_API,
        bodyData: {
          emailOrMsisdn: email,
          socialSignup: false,
          socialToken: "",
        },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);
      toast.success(data.message, { pauseOnHover: false });

      if (response.data.status == "SUCCESS") {
        // localStorage.setItem("otpContext", "signupOTP");
        // dispatch(setOtpContext("signupOTP"));
        dispatch(userEmail(email));
        navigate("/otpverification");
        console.log(data.message); // Optional
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
  return async (): Promise<void> => {
    try {
      const response = await apiConnector<{
        success: boolean;
        message: string;
        status: string;
      }>({
        method: "POST",
        url: SIGNUP_RESEND_OTP,
        bodyData: { emailOrMsisdn: email, socialSignup: true, socialToken: "" },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      toast.success(data.message);

      console.log(data.message); // Optional
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



export function forgotp_password_resend_OTP(email: string) {
  return async (): Promise<void> => {
    try {
      const response = await apiConnector<{
        success: boolean;
        message: string;
        status: string;
      }>({
        method: "POST",
        url: FORGOT_RESEND_PASSWORD_OTP_API, //IT WAS RESEND OTP BEFORE
        bodyData: { emailOrMsisdn: email },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      toast.success(data.message);

      console.log(data.message); // Optional
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



export function setPassword(
  pwdSetToken: string,
  password: string,
  confirmedPassword: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return async (): Promise<void> => {
    try {
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
        bodyData: { pwdSetToken, password, confirmedPassword },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      // const token=response.data.data.accessToken
      // dispatch(setAccessToken(token));
      if (response.data.status === "SUCCESS") {
        toast.success("Registration successful!");
        navigate("/login");
      }

      console.log(data.message); // Optional
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


export function signIn(
  email: string,
  password: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return async (): Promise<void> => {
    try {
      dispatch(setLoading(true));

      const response = await apiConnector<{
        message: string;
        status: string;
        data: {
          accessTokenExpiry: string;
          refreshTokenExpiry: string;
          profileRequired: boolean;
       
        };
      }>({
        method: "POST",
        url: LOGIN_API,
        bodyData: {
          emailOrMsisdn: email,
          socialSignup: false,
          socialToken: "",
          password,
        },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });


      const data = response.data;
      console.log("LOGIN API RESPONSE............", data);

      const { accessTokenExpiry, refreshTokenExpiry } = data.data;

      const aceessTokenExpirTime= new Date(accessTokenExpiry);
      const refrehTokenExpirTime= new Date(refreshTokenExpiry);
      const now = new Date();

      console.log("current time : ", now.toLocaleTimeString())
      console.log("accessTokenExpiry Time :" ,aceessTokenExpirTime.toLocaleTimeString());
      console.log( "refreshTokenExpiry Time :",refrehTokenExpirTime.toLocaleTimeString());

      if (data.status === "SUCCESS") {
        dispatch(getCurrentUser());
        // localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("refreshToken", refreshToken); // ✅ Store refresh token
        localStorage.setItem("accessTokenExpiry", accessTokenExpiry); // ✅ Store refresh token
        localStorage.setItem("refreshTokenExpiry",refreshTokenExpiry); // ✅ Store refresh token
        
        dispatch(setAccessTokenExpiry(response.data.data.accessTokenExpiry));
        dispatch(setRefreshTokenExpiry(response.data.data.refreshTokenExpiry));

        navigate("/");
      }


    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setMassage(error.response?.data?.message || "Login failed"));
        // toast.error(error.response?.data?.message || "Login failed");
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

// export function varifySignInOTP(
//   tempToken: string,
//   otp: string,
//   dispatch: AppDispatch,
//   navigate: NavigateFunction
// ) {
//   return async (): Promise<void> => {
//     try {
//       const response = await apiConnector<{
//         message: string;
//         status: string;
//         data: {
//           accessToken: string;
//         };
//       }>({
//         method: "POST",
//         url: VARIFY_LOGIN_OTP,
//         bodyData: { tempToken, otp },
//         headers: {
//           "X-Client-Source": "OTHER",
//         },
//       });

//       const data = response.data;
//       console.log("SIGNUP API RESPONSE............", data);

//       const Token = response.data.data.accessToken;
//       dispatch(setAccessToken(Token));

//       toast.success("OTP verificaion Successfull");
//       navigate("/");
//       // console.log(data.message); // Optional
//       // navigate("/varifylgoinotp");
//     } catch (error) {
//       // ✅ Use AxiosError to get error response
//       if (axios.isAxiosError(error)) {
//         const errorData = error;
//         toast.error(error.response?.data?.message);
//         console.log("SIGNUP API ERROR RESPONSE............", errorData);
//       } else {
//         console.log(
//           "SIGNUP API ERROR............",
//           "An unknown error occurred."
//         );
//       }
//     }
//   };
// }



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
          setPWDToken: string;
        };
      }>({
        method: "POST",
        url: FORGOT_PASSWORD_OTP,
        bodyData: { emailOrMsisdn: email },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      const pwdToken = response.data.data.setPWDToken;
      dispatch(setPwdToken(pwdToken));

      toast.success("OTP sent successfully");
      // console.log(data.message); // Optional

      navigate("/passwordreset");
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



export function resetPassword(
  token: string,
  password: string,
  cnfPass: string,
  otp: string,
  navigate: NavigateFunction
) {
  return async (): Promise<void> => {
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
        url: RESET_PASSWORD,
        bodyData: {
          pwdSetToken: token,
          password: password,
          confirmedPassword: cnfPass,
          otp,
        },
        headers: {
          "X-Client-Source": "OTHER",
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

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



export function logout(
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return async (): Promise<void> => {
    try {
      // Make logout API call if needed
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
      // dispatch(setRefreshToken(""));
      dispatch(clearUser());

      // stopAutoTokenRefresh();

      // Optionally clear cookies if you're using cookies

      // ✅ Navigate to login/home page
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Logout Error:", error.response?.data?.message);
      } else {
        console.error("Unexpected Logout Error:", error);
      }
    }
  };
}

