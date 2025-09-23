// src/features/EventAvailability/EventAvailabilitySlice.ts
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { AvailableShow } from "../services/operations/eventsApi";



interface EventAvailabilityState {
  eventShows: AvailableShow[] | null;
  loading: boolean;
}

const initialState: EventAvailabilityState = {
  eventShows: null,
  loading: false,
};

const eventAvailabilitySlice = createSlice({
  name: "eventAvailability",
  initialState,
  reducers: {
    setAvailableEventShows: (state, action: PayloadAction<AvailableShow[]>) => {
      state.eventShows = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearAvailableEventShows: (state) => {
      state.eventShows = null;
    },
  },
});

export const { setAvailableEventShows, setLoading, clearAvailableEventShows } = eventAvailabilitySlice.actions;
export default eventAvailabilitySlice.reducer;
