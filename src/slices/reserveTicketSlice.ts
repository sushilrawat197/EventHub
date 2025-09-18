// src/slices/bookingSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookingData } from "../interfaces/reserveTicketInterface";

// Slice state
interface BookingState {
  booking: BookingData | null;
  loading: boolean;
  error: string | null;
}


const initialState: BookingState = {
  booking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action: PayloadAction<BookingData>) => {
      state.booking = action.payload;
      state.error = null;
    },
    clearBooking: (state) => {
      state.booking = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

// Export actions
export const { setBooking, clearBooking, setLoading, setError } =
  bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;
