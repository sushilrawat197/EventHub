import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookingResponse } from "../interfaces/confirmBookingInterface";


interface BookingState {
  booking: BookingResponse | null;
  loading: boolean | null;
  cancelTicketLoading: boolean | null;
  error: string | null;
}

const initialState: BookingState = {
  booking: null,
  loading: null,
  error: null,
  cancelTicketLoading:null
};


const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCancelTicketLoading(state, action: PayloadAction<boolean>) {
      state.cancelTicketLoading = action.payload;
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

export const { setLoading, setError, setConfirmBooking, clearConfirmBooking,setCancelTicketLoading } =
  bookingSlice.actions;

export default bookingSlice.reducer;