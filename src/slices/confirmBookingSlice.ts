import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookingResponse } from "../interfaces/confirmBookingInterface";


interface BookingState {
  booking: BookingResponse | null;
  loading: boolean | null;
  error: string | null;
}

const initialState: BookingState = {
  booking: null,
  loading: null,
  error: null,
};


const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {                
      state.error = action.payload;
    },
    setConfirmBooking(state, action: PayloadAction<BookingResponse>) {
      state.booking = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearConfirmBooking(state) {
      state.booking = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setError, setConfirmBooking, clearConfirmBooking } =
  bookingSlice.actions;

export default bookingSlice.reducer;