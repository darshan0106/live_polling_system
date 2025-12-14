import { configureStore, createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    role: null, // 'teacher' | 'student'
    name: "",
    connected: false,
    kicked: false,
    messages: [],
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setKicked: (state) => {
      state.kicked = true;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

const pollSlice = createSlice({
  name: "poll",
  initialState: {
    current: null, // { question, options, timeLeft, active }
    history: [],
    hasVoted: false,
    participants: [], // For teacher
  },
  reducers: {
    setPoll: (state, action) => {
      state.current = action.payload;
      state.hasVoted = false;
    },
    updateTimer: (state, action) => {
      if (state.current) state.current.timeLeft = action.payload;
    },
    updateResults: (state, action) => {
      state.current = action.payload;
    },
    setHasVoted: (state) => {
      state.hasVoted = true;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    appendHistory: (state, action) => {
      state.history.push(action.payload);
    },
  },
});

export const { setRole, setName, setConnected, setKicked, addMessage } =
  appSlice.actions;
export const {
  setPoll,
  updateTimer,
  updateResults,
  setHasVoted,
  setParticipants,
  setHistory,
  appendHistory,
} = pollSlice.actions;

export const store = configureStore({
  reducer: { app: appSlice.reducer, poll: pollSlice.reducer },
});
