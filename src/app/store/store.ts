import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/store/authSlice";
import userReducer from "../../features/profile/store/userSlice";
import filterReduce from "../../features/events/store/filterSlice";
import ticketReduce from "../../features/booking/store/ticketInfoSlice";
import cityReducer from "../../features/events/store/citySlice";
import eventReducer from "../../features/events/store/eventSlice";
import showReducer from "../../features/events/store/showSlice";
import searchFilterReducer from "../../features/events/store/filter_Slice";
import ticketCategoryReducer from "../../features/booking/store/ticketCategory";
import venueReducer from "../../features/events/store/venueSlice";
import reserveTicketReducer from "../../features/booking/store/reserveTicketSlice";
import confirmBookingReducer from "../../features/booking/store/confirmBookingSlice";
import orderReducer from "../../features/orders/store/orderDetails";
import payReducer from "../../features/payment/store/payTicketSlice";
import availableReducer from "../../features/payment/store/availabilitySlice";

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
    availability:availableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
