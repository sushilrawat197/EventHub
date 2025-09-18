import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface PriceGroup {
  min: number;
  max: number;
}

export interface EventSearchFilters {
  cityId?: number;
  genres?: string[];
  languages?: string[];
  datePresets?: ("TODAY" | "TOMORROW" | "WEEKEND")[];
  venueIds?: number[];
  priceGroups?: PriceGroup[];
  startDate?: string | null;
  endDate?: string | null;
}

const initialState: EventSearchFilters = {
  cityId: undefined,
  genres: [],
  languages: [],
  datePresets: [],
  venueIds: [],
  priceGroups: [],
  startDate: null,
  endDate: null,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof EventSearchFilters; value: any }>) => {
      state[action.payload.key] = action.payload.value;
    },
    resetFilter: () => initialState,
  },
});


export const { setFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
