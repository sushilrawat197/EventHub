import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// User ka type
interface User {
  userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  msisdn: string | null;
  profilePicUrl: string;
  allowEmailNotifications: boolean;
  allowSmsNotifications: boolean;
  allowPushNotifications: boolean;
}

// State ka type
interface UserState {
  user: User | null;
}

// Initial state
const initialState: UserState = {
  user: null,
};

// Slice
const userSlice = createSlice({

  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

// Export
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
