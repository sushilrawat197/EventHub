import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Content } from "../interfaces/eventInterface/eventInterface"; // yaha tumhare Content interface ko import karo


interface EventsState {
  events: Content[];
  categories: string[];
  venues: string[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  categories: [],
  venues: [],
  loading: false,
  error: null,
};


const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setEvents: (
      state,
      action: PayloadAction<{
        contents: Content[];
        catogeryList: string[];
        venueList: string[];
      }>
    ) => {
      state.events = action.payload.contents || [];
      state.categories = action.payload.catogeryList || [];
      state.venues = action.payload.venueList || [];
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    clearEvents: (state) => {
      state.events = [];
      state.categories = [];
      state.venues = [];
      state.error = null;
    },
  },
});

export const { setLoading, setEvents, setError, clearEvents } =
  eventsSlice.actions;

export default eventsSlice.reducer;
