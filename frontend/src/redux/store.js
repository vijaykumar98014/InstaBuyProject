import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import themeReducer from "./themeSlice";
import { setAuthToken } from "../services/api";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    theme: themeReducer,
  },
});

setAuthToken(store.getState().user.token);

store.subscribe(() => {
  setAuthToken(store.getState().user.token);
});

export default store;