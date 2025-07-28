import { endpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { type NavigateFunction } from "react-router-dom";
import { setPwdToken, userEmail,setAccessToken} from "../../slices/authSlice";
import type { Dispatch } from '@reduxjs/toolkit';
const { SIGNUP_API, SEND_OTP_API, RESEND_OTP,SET_PASS_API,LOGIN_API,VARIFY_LOGIN_OTP } = endpoints;
import axios from "axios";
import { toast } from "react-hot-toast"


type SendOtpApiResponse = {
  status: string;
  statusCode: number;
  message: string;
  data: {
    setPWDToken: string;
    setPWDTokenExpiry: string;
  };
};

export function sendOtp(otpString:string,email:string, navigate:NavigateFunction) {
  return async (
    dispatch:Dispatch
  ): Promise<void> => {
   

    try {
      const response = await apiConnector<SendOtpApiResponse>(
      {
         method:"POST",
         url:SEND_OTP_API,
         bodyData:{emailOrMsisdn:email,otp:otpString},
         headers: {
          "X-Client-Source": "OTHER"
        },
      });

      console.log("SENDOTP API RESPONSE............", response)

      console.log("PWToken", response?.data?.data?.setPWDToken);
      
      dispatch(setPwdToken(response?.data?.data?.setPWDToken));

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




export function setPassword(
  pwdSetToken:string,
  password:string,
  confirmedPassword:string,
  navigate: NavigateFunction,
  // dispatch:Dispatch
) {
  return async (): Promise<void> => {
    try {
      
      const response = await apiConnector<{ 
        message:string,
        data:{
          accessToken: string;
          refreshToken: string;
          accessTokenExpiry: string;
          refreshTokenExpiry: string;
          profileRequired: boolean;
        }

      }>({
        method: "POST",
        url: SET_PASS_API,   
        bodyData: { pwdSetToken ,password , confirmedPassword },
        headers: {
          "X-Client-Source": "OTHER"
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      // const token=response.data.data.accessToken
      // dispatch(setAccessToken(token));
      toast.success(data.message)

      console.log(data.message); // Optional
      navigate("/login");
    

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



export function signIn(
  email:string,
  password:string,
  navigate: NavigateFunction,
  
) {
  return async (): Promise<void> => {
    try {
      
      const response = await apiConnector<{ 
        message:string,
        data:{
          tempToken:string
        }

      }>({
        method: "POST",
        url:LOGIN_API ,   
        bodyData: { emailOrMsisdn:email,socialSignup:false, socialToken:"",password},
        headers: {
          "X-Client-Source": "OTHER"
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      const Token=response.data.data.tempToken;

      localStorage.setItem("tempToken",Token);
      toast.success("OTP sent successfully")

      // console.log(data.message); // Optional
      navigate("/varifylgoinotp");
    

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




export function varifySignInOTP(

  tempToken:string,
  otp:string,
  dispatch:Dispatch,
  navigate:NavigateFunction
  
) {
  return async (): Promise<void> => {
    try {
      
      const response = await apiConnector<{ 
        message:string,
        data:{
          accessToken:string
        }

      }>({
        method: "POST",
        url:VARIFY_LOGIN_OTP ,   
        bodyData: { tempToken,otp},
        headers: {
          "X-Client-Source": "OTHER"
        },
      });

      const data = response.data;
      console.log("SIGNUP API RESPONSE............", data);

      const Token=response.data.data.accessToken;
      dispatch(setAccessToken(Token));


      toast.success("OTP varificaion Successfull")
      navigate("/")
      // console.log(data.message); // Optional
      // navigate("/varifylgoinotp");
    
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



