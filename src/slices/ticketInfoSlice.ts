// types.ts

type Show = {
  showId: number;
  showDateTime: string;
  maxTicketsPerPerson: number;
  availableSeats: number;
  venue: {
    venueId: number;
    name: string;
    city: string;
    address: string;
    capacity: number;
    facilities: string[];
  };
};

// showSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ShowState {
  show: Show | null; 
}

const initialState: ShowState = {
  show: null,
};

const showSlice = createSlice({
  name: "show",
  initialState,
  reducers: {
    setShow: (state, action: PayloadAction<Show>) => {
      state.show = action.payload; // 👈 ek show assign karega
    },
    clearShow: (state) => {
      state.show = null;
    },
  },
});

export const { setShow, clearShow } = showSlice.actions;
export default showSlice.reducer;
