import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


// User ka type
interface User {
  userId: string;
  email: string;
  mobile: string;
  accountStatus: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  avatarUrl: string;
  roles: string[];
}

// State ka type
interface UserState {
  user: User | null;
  loading:boolean
}

// Initial state
const initialState: UserState = {
  user: null,
  loading:false
};

// Slice
const userSlice = createSlice({

  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    clearUser(state) {
      state.user = null;
    },
  },
});

// Export
export const { setUser, clearUser,setLoading } = userSlice.actions;
export default userSlice.reducer;
