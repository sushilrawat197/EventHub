import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { type NavigateFunction } from "react-router-dom";
import { userEmail} from "../../slices/authSlice";
import type { Dispatch } from '@reduxjs/toolkit';
const { SIGNUP_API, SEND_OTP_API, RESEND_OTP } = endpoints;
import axios from "axios";
import { toast } from "react-hot-toast"



export function sendOtp(otpString:string,email:string, navigate:NavigateFunction) {
  return async (): Promise<void> => {
   
    try {
      const response = await apiConnector<{ success: boolean; message: string }>(
      {
         method:"POST",
         url:SEND_OTP_API,
         bodyData:{emailOrMsisdn:email,otp:otpString},
         headers: {
          "X-Client-Source": "OTHER"
        },
      });

      console.log("SENDOTP API RESPONSE............", response)
      console.log(response)

      navigate("/setpassword");

      toast.success("Verification Successfull")

    } catch (error) {
     if (axios.isAxiosError(error)) {
        const errorData = error
        toast.error(error.response?.data?.message)
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
       
      } else {
        console.log("SIGNUP API ERROR............", "An unknown error occurred.");
      }
    }
 
  }
}


export function signUp(
  email: string,
  navigate: NavigateFunction,
  dispatch:Dispatch
) {
  return async (): Promise<void> => {
    try {
      const response = await apiConnector<{ success: boolean; message: string }>({
        method: "POST",
        url: SIGNUP_API,
        bodyData: { emailOrMsisdn:email,socialSignup:false,socialToken:"" },
        headers: {
          "X-Client-Source": "OTHER"
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);
      toast.success(data.message)

      console.log(data.message); // Optional
      navigate("/otpvarification");
      dispatch(userEmail(email));


    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error
        toast.error(error.response?.data?.message)
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
       
      } else {
        console.log("SIGNUP API ERROR............", "An unknown error occurred.");
      }
    }
  };
}



export function resendOTP(
  email: string,
  navigate: NavigateFunction,
  dispatch:Dispatch
) {
  return async (): Promise<void> => {
    try {
      const response = await apiConnector<{ success: boolean; message: string }>({
        method: "POST",
        url: RESEND_OTP,
        bodyData: { emailOrMsisdn:email ,socialSignup:true,socialToken:"" },
        headers: {
          "X-Client-Source": "OTHER"
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);
      toast.success(data.message)

      console.log(data.message); // Optional
      navigate("/otpvarification");
      dispatch(userEmail(email));


    } catch (error) {
      // ✅ Use AxiosError to get error response
      if (axios.isAxiosError(error)) {
        const errorData = error
        toast.error(error.response?.data?.message)
        console.log("SIGNUP API ERROR RESPONSE............", errorData);
       
      } else {
        console.log("SIGNUP API ERROR............", "An unknown error occurred.");
      }
    }
  };
}



