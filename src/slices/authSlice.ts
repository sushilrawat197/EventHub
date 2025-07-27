import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userEmail: string;
  userResponse:string; //not used
  pwdToken: string
  accessToken:string,  //not used
  tempToken:string //not used
}

const initialState: AuthState = {
  userEmail: "",
  userResponse:"",
  pwdToken:"",
  accessToken:"",
  tempToken:""
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
    setAccessToken(state, action: PayloadAction<string>) {
    state.accessToken = action.payload;
    },
    setTempToken(state, action: PayloadAction<string>) {
    state.tempToken = action.payload;
    },
  },
});

export const { userEmail,userResponse,setPwdToken,setAccessToken,setTempToken } = authSlice.actions;
export default authSlice.reducer;
