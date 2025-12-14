import { io } from "socket.io-client";

// In production, replace this with your deployed backend URL (e.g., Render URL)
const URL = "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: true,
});
