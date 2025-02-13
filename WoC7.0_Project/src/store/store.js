import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import fileReducer from "./fileSlice";
import loaderReducer from "./LoaderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    loader: loaderReducer, 
  },
});