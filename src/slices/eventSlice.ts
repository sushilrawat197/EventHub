// src/features/Events/EventsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EventResponse, EventResponseBySearch } from "../interfaces/eventInterface/evnetInterFace";
import type { PageData } from "../interfaces/country";

interface EventsState {
  allEvents: PageData<EventResponse> | null;       // sabhi events list
  allEventsBySearch:PageData<EventResponseBySearch> | null;
  singleEvent: EventResponse | null; // ek event by ID
  eventloading: boolean;
}

const initialState: EventsState = {
  allEvents: null,
  allEventsBySearch : null,
  singleEvent: null,
  eventloading: false,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setAllEvents: (state, action: PayloadAction<PageData<EventResponse>>) => {
      state.allEvents = action.payload;
    },
    setAllEventsBySearch: (state, action: PayloadAction<PageData<EventResponseBySearch>>) => {
      state.allEventsBySearch = action.payload;
    },
    setSingleEvent: (state, action: PayloadAction<EventResponse | null>) => {
      state.singleEvent = action.payload;
    },
    setEventsLoading: (state, action: PayloadAction<boolean>) => {
      state.eventloading= action.payload;
    },
    clearSingleEvent: (state) => {
      state.singleEvent = null; // navigate karte waqt reset karne ka option
    }
  },
});

export const {
  setAllEvents,
  setSingleEvent,
  setEventsLoading,
  clearSingleEvent,
  setAllEventsBySearch
} = eventsSlice.actions;

export default eventsSlice.reducer;
