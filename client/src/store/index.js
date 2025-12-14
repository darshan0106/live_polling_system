import { configureStore } from "@reduxjs/toolkit";

// USE CURLY BRACES FOR BOTH
import { pollReducer } from "./pollSlice";
import { uiReducer } from "./uiSlice";

// Debug check
console.log("Reducers Loaded:", { pollReducer, uiReducer });

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    ui: uiReducer,
  },
});
