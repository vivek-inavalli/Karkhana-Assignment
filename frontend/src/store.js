import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemsReducer from "./slices/itemsSlice";
import otherCostsReducer from "./slices/otherCostsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
  },
});

export default store;
