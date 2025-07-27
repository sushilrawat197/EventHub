import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userEmail: string;
  userResponse:string;
}

const initialState: AuthState = {
  userEmail: "",
  userResponse:""
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
  },
});

export const { userEmail,userResponse } = authSlice.actions;
export default authSlice.reducer;
