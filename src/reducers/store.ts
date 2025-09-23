import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice"
import filterReduce from "../slices/filterSlice"
import ticketReduce from "../slices/ticketInfoSlice"
import cityReducer from "../slices/citySlice"
import eventReducer from "../slices/eventSlice"
import showReducer from "../slices/showSlice"
import searchFilterReducer from "../slices/filter_Slice"
import ticketCategoryReducer from "../slices/ticketCategory"
import venueReducer from "../slices/venueSlice"
import reserveTicketReducer from "../slices/reserveTicketSlice"
import confirmBookingReducer from "../slices/confirmBookingSlice"
import orderReducer from "../slices/orderDetails"
import payReducer from "../slices/payTicketSlice"

export const store = configureStore({
  
  reducer: {
    auth: authReducer,
    user:userReducer,
    filter:filterReduce,
    searchFilter:searchFilterReducer ,
    ticket:ticketReduce,
    cities:cityReducer,
    events:eventReducer,
    shows:showReducer,
    ticketCategory:ticketCategoryReducer,
    venue:venueReducer,
    reserveTicket:reserveTicketReducer,
    confirmBooking:confirmBookingReducer,
    order:orderReducer,
    pay:payReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
