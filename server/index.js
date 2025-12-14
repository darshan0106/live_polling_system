const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const store = require("./src/store/memoryStore");
const registerPollHandlers = require("./src/handlers/pollHandlers");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // --- Role Management ---

  // Teacher Join
  socket.on("join:teacher", () => {
    store.teacherId = socket.id;
    // Send initial state to teacher
    socket.emit("init:state", {
      history: store.polls,
      currentPoll: store.currentPoll,
    });
    // Send participant list
    io.emit("participants:update", Object.values(store.students));
  });

  // Student Join
  socket.on("join:student", (name) => {
    store.students[socket.id] = { id: socket.id, name };
    socket.emit("init:state", { currentPoll: store.currentPoll });
    io.emit("participants:update", Object.values(store.students));
  });

  // Kick Student (Teacher only)
  socket.on("kick:student", (socketId) => {
    if (store.students[socketId]) {
      io.to(socketId).emit("student:kicked"); // Notify student
      io.sockets.sockets.get(socketId)?.disconnect(true); // Force disconnect
      delete store.students[socketId];
      io.emit("participants:update", Object.values(store.students)); // Update list
    }
  });

  // --- Chat ---
  socket.on("chat:send", (payload) => {
    // payload: { text, sender, time }
    io.emit("chat:receive", payload);
  });

  // --- Poll Logic ---
  registerPollHandlers(io, socket);

  // --- Disconnect ---
  socket.on("disconnect", () => {
    if (store.students[socket.id]) {
      delete store.students[socket.id];
      io.emit("participants:update", Object.values(store.students));
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
