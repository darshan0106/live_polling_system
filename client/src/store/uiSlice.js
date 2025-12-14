import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    role: null,
    name: "",
    isKicked: false,
    participants: [],
    messages: [],
  },
  reducers: {
    setUser: (state, action) => {
      console.log("REDUCER: setUser called", action.payload);
      state.role = action.payload.role;
      state.name = action.payload.name;
    },
    setRole: (state, action) => {
      console.log("REDUCER: setRole called", action.payload);
      state.role = action.payload;
    },
    setKicked: (state) => {
      state.isKicked = true;
    },
    updateParticipants: (state, action) => {
      state.participants = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setUser, setRole, setKicked, updateParticipants, addMessage } =
  uiSlice.actions;

export const uiReducer = uiSlice.reducer;
