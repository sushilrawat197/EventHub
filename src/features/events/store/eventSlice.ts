import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
  eventErrorMsg: string | null;
}

const initialState: EventsState = {
  eventErrorMsg: "",
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventsErrorMsg: (state, action: PayloadAction<string>) => {
      state.eventErrorMsg = action.payload;
    },
  },
});

export const { setEventsErrorMsg } = eventsSlice.actions;

export default eventsSlice.reducer;
