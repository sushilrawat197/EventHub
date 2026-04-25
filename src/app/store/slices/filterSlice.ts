// reducers/filterSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  categories: string[];
  languages: string[];
  dates: string[];  
  prices: string[];
  startDate: string | null;
  endDate: string | null;
}


const initialState: FilterState = {
  categories: [],
  languages: [],
  dates: [],
  prices: [],
  startDate: null, // e.g. "2025-08-21"
  endDate: null,   // e.g. "2025-08-25"
};


const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setLanguages: (state, action: PayloadAction<string[]>) => {
      state.languages = action.payload;
    },
    setDates: (state, action: PayloadAction<string[]>) => {
      state.dates = action.payload;
    },
    setPrices: (state, action: PayloadAction<string[]>) => {
      state.prices = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },

  },
});

export const { setCategories, setLanguages,setDates,setPrices,setStartDate,setEndDate } = filterSlice.actions;
export default filterSlice.reducer;
