import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { payTickeResponse } from "../interfaces/payTicketInterface";

interface BookingState {
  booking: payTickeResponse | null;
  payMessege: string
}

const initialState: BookingState = {
  booking: null,
  payMessege:""
};

// ---- Slice ----
const bookingSlice = createSlice({
  name: "payTicket",
  initialState,
  reducers: {
    setPayTicket: (state, action: PayloadAction<payTickeResponse>) => {
      state.booking = action.payload;
    },
    setPayMessage: (state, action: PayloadAction<string>) => {
      state.payMessege = action.payload;
    },
    clearPayTicket: (state) => {
      state.booking = null;
    },
  },
});

export const { setPayTicket, clearPayTicket, setPayMessage } = bookingSlice.actions;
export default bookingSlice.reducer;