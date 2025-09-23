import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { payTickeResponse } from "../interfaces/payTicketInterface";

interface BookingState {
  booking: payTickeResponse | null;
  payMessege: string
  payTicketLoading:boolean | null
}

const initialState: BookingState = {
  booking: null,
  payMessege:"",
  payTicketLoading:false
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
    setPayTicketLoading:(state, action: PayloadAction<boolean>) => {
      state.payTicketLoading = action.payload;
    },
  },
});

export const { setPayTicket, clearPayTicket, setPayMessage, setPayTicketLoading } = bookingSlice.actions;
export default bookingSlice.reducer;