import { createSlice } from "@reduxjs/toolkit";

const pollSlice = createSlice({
  name: "poll",
  initialState: {
    currentPoll: null,
    history: [],
    hasVoted: false,
  },
  reducers: {
    setPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.hasVoted = false;
    },
    updateTimer: (state, action) => {
      if (state.currentPoll) state.currentPoll.timeLeft = action.payload;
    },
    updateResults: (state, action) => {
      state.currentPoll = action.payload;
    },
    markVoted: (state) => {
      state.hasVoted = true;
    },
    setHistory: (state, action) => {
      state.history = action.payload || [];
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
  },
});

export const {
  setPoll,
  updateTimer,
  updateResults,
  markVoted,
  setHistory,
  addToHistory,
} = pollSlice.actions;

export const pollReducer = pollSlice.reducer;
