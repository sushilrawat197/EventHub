import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userEmail: string;
  userResponse: string; //not used
  pwdToken: string
  accessToken: null | string,
  tempToken: string //not used
  loading: boolean,
  massage: null | string,
  otpContext: string,
  refreshToken:string,
  accessTokenExpiry:string
}

const initialState: AuthState = {
  userEmail: "",
  userResponse: "",
  pwdToken: "",
  accessToken: null, //localStorage.getItem("token")
  tempToken: "",
  loading: false,
  massage: null,
  otpContext: "",
  refreshToken:"",
  accessTokenExpiry:""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userEmail(state, action: PayloadAction<string>) {
      state.userEmail = action.payload;
    },
    userResponse(state, action: PayloadAction<string>) {
      state.userResponse = action.payload;
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
  },
});

export const {
  userEmail,
  userResponse,
  setPwdToken,
  setAccessToken,
  setTempToken,
  setLoading,
  setMassage,
  setOtpContext,
  setRefreshToken,
  setAccessTokenExpiry
} = authSlice.actions;
export default authSlice.reducer;
