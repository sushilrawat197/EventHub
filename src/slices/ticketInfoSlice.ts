// showSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


// types.ts
export type TicketInfo = {
  venueId: number | null;
  venueName: string;
  showId: number | null;
  categoryId: number | null;
  ticketCount: number | null;
};


const initialState: TicketInfo = {
  venueId: null,
  venueName: "",
  showId: null,
  categoryId: null,
  ticketCount: null,
};

const ticketInfoSlice = createSlice({
  name: "ticketInfo",
  initialState,
  reducers: {
    setTicketInfo: (state, action: PayloadAction<Partial<TicketInfo>>) => {
      return { ...state, ...action.payload };
    },
    resetTicketInfo: () => initialState,
  },
});

export const { setTicketInfo, resetTicketInfo } = ticketInfoSlice.actions;
export default ticketInfoSlice.reducer;
