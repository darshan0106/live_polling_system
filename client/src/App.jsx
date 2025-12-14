import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./socket";
import {
  setPoll,
  updateTimer,
  updateResults,
  addToHistory,
  setHistory,
} from "./store/pollSlice";
import { updateParticipants, setKicked, addMessage } from "./store/uiSlice";

import LandingPage from "./pages/LandingPage";
import NameEntry from "./pages/NameEntry";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import KickedScreen from "./pages/KickedScreen";
import { ChatWidget } from "./components/chat/ChatWidget";

export default function App() {
  const dispatch = useDispatch();

  const fullState = useSelector((state) => state);
  console.log("FULL REDUX STATE:", fullState);

  // --- DEBUGGING LINE ---
  // Watch your console. If "role" stays null, the store is broken.
  const uiState = useSelector((state) => state.ui);
  console.log("APP State Check:", uiState);

  const { role, isKicked, name } = uiState || {}; // Safe destructuring

  useEffect(() => {
    // --- Socket Listeners ---
    socket.on("poll:started", (data) => dispatch(setPoll(data)));
    socket.on("poll:timer", (time) => dispatch(updateTimer(time)));
    socket.on("poll:updated", (data) => dispatch(updateResults(data)));
    socket.on("poll:ended", (data) => {
      dispatch(updateResults(data));
      if (role === "teacher") dispatch(addToHistory(data));
    });

    socket.on("participants:update", (list) =>
      dispatch(updateParticipants(list))
    );
    socket.on("student:kicked", () => dispatch(setKicked()));
    socket.on("chat:receive", (msg) => dispatch(addMessage(msg)));

    socket.on("init:state", ({ history, currentPoll }) => {
      if (history) dispatch(setHistory(history));
      if (currentPoll) dispatch(setPoll(currentPoll));
    });

    return () => socket.off();
  }, [dispatch, role]);

  // --- ROUTING LOGIC ---
  if (isKicked) return <KickedScreen />;

  // If role is null, we show LandingPage
  if (!role) return <LandingPage />;

  // If student pending, show NameEntry
  if (role === "student_pending") return <NameEntry />;

  return (
    <div className="min-h-screen bg-bgLight font-sans text-dark flex flex-col items-center">
      {role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />}
      <ChatWidget userName={name} isTeacher={role === "teacher"} />
    </div>
  );
}
