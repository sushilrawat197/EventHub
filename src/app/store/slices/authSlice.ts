import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
  userEmail: string
  otp:string
  signupToken:string
  pwdToken: string
  accessToken: null | string,
  tempToken: string //not used
  loading: boolean,
  massage: null | string,
  otpContext: string,
  refreshToken:string,
  accessTokenExpiry:string,
  refreshTokenExpiry:string
}

const initialState: AuthState = {
  userEmail: "",
  otp:"",
  signupToken: "",
  pwdToken: "",
  accessToken: null, //localStorage.getItem("token")
  tempToken: "",
  loading: false,
  massage: null,
  otpContext: "",
  refreshToken:"",
  accessTokenExpiry:"",
  refreshTokenExpiry:""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userEmail(state, action: PayloadAction<string>) {
      state.userEmail = action.payload;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    setSignupToken(state, action: PayloadAction<string>) {
      state.signupToken = action.payload;
    },
    setPwdToken(state, action: PayloadAction<string>) {
      state.pwdToken = action.payload;
    },
    setAccessToken(state, action: PayloadAction<null | string>) {
      state.accessToken = action.payload;
    },
    setTempToken(state, action: PayloadAction<string>) {
      state.tempToken = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMassage(state, action: PayloadAction<null | string>) {
      state.massage = action.payload;
    },
    setOtpContext(state, action: PayloadAction<string>) {
      state.otpContext = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
    },
    setAccessTokenExpiry(state, action: PayloadAction<string>) {
      state.accessTokenExpiry = action.payload;
    },
    setRefreshTokenExpiry(state, action: PayloadAction<string>) {
      state.refreshTokenExpiry = action.payload;
    },
  },
});

export const {
  userEmail,
  setOtp,
  setSignupToken,
  setPwdToken,
  setAccessToken,
  setTempToken,
  setLoading,
  setMassage,
  setOtpContext,
  setRefreshToken,
  setAccessTokenExpiry,
  setRefreshTokenExpiry
} = authSlice.actions;
export default authSlice.reducer;
