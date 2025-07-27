import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userEmail: string;
  userResponse:string;
  pwdToken: string
}

const initialState: AuthState = {
  userEmail: "",
  userResponse:"",
  pwdToken:""
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
  }
  },
});

export const { userEmail,userResponse,setPwdToken } = authSlice.actions;
export default authSlice.reducer;
