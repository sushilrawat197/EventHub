// orderDetailsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PageData } from "../interfaces/country";

export interface OrderDetails {
  bookingId: number;
  orderNo: string;
  orderDateTime: string;
  eventName: string;
  status: string;
  amount: number;
}

interface OrderDetailsState {
  order:PageData<OrderDetails>  | null;
}

const initialState: OrderDetailsState = {
  order: null,
};

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    setOrderDetails: (state, action: PayloadAction<PageData<OrderDetails>> ) => {
      state.order = action.payload;
    },
    clearOrderDetails: (state) => {
      state.order = null;
    },

  },
});

export const { setOrderDetails, clearOrderDetails, } =
  orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;
