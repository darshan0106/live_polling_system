import { configureStore } from "@reduxjs/toolkit";

import { pollReducer } from "./pollSlice";
import { uiReducer } from "./uiSlice";


export const store = configureStore({
  reducer: {
    poll: pollReducer,
    ui: uiReducer,
  },
});
