import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice"
import eventReduce from "../slices/eventSlice"
import filterReduce from "../slices/filterSlice"


export const store = configureStore({
  
  reducer: {
    auth: authReducer,
    user:userReducer,
    events:eventReduce,
    filter:filterReduce
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
