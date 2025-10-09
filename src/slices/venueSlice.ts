import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


import type { VenueResponse } from "../interfaces/venueInterface";


interface VenueState {
  data:VenueResponse[] | null;
  venueDetails:VenueResponse | null,
  loading: boolean;
  error: string | null;
}

const initialState: VenueState = {
  data: [],
  venueDetails:null,
  loading: false,
  error: null,
};


const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<VenueResponse[]>) => {
      state.data = action.payload;
    },
    setVenueDetails: (state, action: PayloadAction<VenueResponse>) => {
      state.venueDetails = action.payload;
    },
    setVenueLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setVenueError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearVenuesError: (state) => {
      state.error = null;
    },
  },
});

export const { setVenues, setVenueLoading, setVenueError, clearVenuesError, setVenueDetails } =
  venueSlice.actions;

export default venueSlice.reducer;
