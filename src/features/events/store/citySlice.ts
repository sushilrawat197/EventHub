// src/features/country/countrySlice.ts
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

export interface citiesResponse {
  id: number,
  label:string ,
}

interface CitiesState {
  data: citiesResponse[] | null;
  selectedCity:number | null |undefined,
  loading: boolean;
  error: CitiesError | null; // 👈 ab object me store
}

const initialState: CitiesState = {
  data: null,
  selectedCity:null,
  loading: false,
  error: null,
};

export interface CitiesError {
  name?: string;
  active?: string;
  countryId?: string;
}


const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<citiesResponse[]>) => {
      state.data = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<number>) => {
      state.selectedCity = action.payload;
    },
    setCitiesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCitiesError: (state, action: PayloadAction<CitiesError | null>) => {
      state.error = action.payload;
    },
    clearCitiesError: (state) => {
      state.error = null;
    },
  },
});

export const { setCities,setCitiesLoading,setCitiesError,clearCitiesError,setSelectedCity } =
  regionSlice.actions;
export default regionSlice.reducer;


