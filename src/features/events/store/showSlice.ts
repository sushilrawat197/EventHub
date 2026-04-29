// src/features/Shows/ShowsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface ShowResponse {
  showId: number;
  showDate: string;     // "YYYY-MM-DD"
  startTime: string;    // "HH:mm:ss"
  endTime: string;      // "HH:mm:ss"
  eventId: number;
  eventName: string;
  venueId: number;
  venueName: string;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED"; // possible status values
  basePrice: number;
  bookingType: string
}



interface ShowsState {
  data: ShowResponse[]; // array of shows
  loading: boolean;
}

const initialState: ShowsState = {
  data: [],
  loading: false,
};

const showsSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {
    setShows: (state, action: PayloadAction<ShowResponse[]>) => {
      state.data = action.payload;
    },

    setShowsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSetShows: (state) => {
      state.data = [];   // 👈 ab yeh allowed hai
    },

  },
});

export const { setShows, setShowsLoading,clearSetShows } =
  showsSlice.actions;

export default showsSlice.reducer;
