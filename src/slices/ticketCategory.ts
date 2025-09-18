import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Ticket Category type
export interface TicketCategoryLayout {
  rows: number;
  seatsPerRow: number;
  rowLabels: string[];
}

export interface TicketCategory {
categoryId:number;
showId:number;
  name: string;
  price: number;
  capacity: number;
  description: string;
  layout: TicketCategoryLayout;
}

// Error type for TicketCategory
export interface TicketCategoryErrorResponse {
  name?: string;
  price?: string;
  capacity?: string;
  description?: string;
  layout?: string;
}

// Slice state
interface TicketCategoryState {
  data: TicketCategory[] | null;
  loading: boolean;
  error: TicketCategoryErrorResponse | null;
}

const initialState: TicketCategoryState = {
  data: null,
  loading: false,
  error: null,
};

const ticketCategorySlice = createSlice({
  name: "ticketCategory",
  initialState,
  reducers: {
    setTicketCategories: (state, action: PayloadAction<TicketCategory[]>) => {
      state.data = action.payload;
    },
    setTicketCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTicketCategoriesError: (state,action: PayloadAction<TicketCategoryErrorResponse | null>) => {
      state.error = action.payload;
    },
    clearTicketCategoriesError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setTicketCategories,
  setTicketCategoriesLoading,
  setTicketCategoriesError,
  clearTicketCategoriesError,
} = ticketCategorySlice.actions;

// Export reducer
export default ticketCategorySlice.reducer;
