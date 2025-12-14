import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket";
import { setUser } from "../store/uiSlice";
import { Button } from "../components/common/Button";

const NameEntry = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(setUser({ role: "student", name: input }));
    socket.emit("join:student", input);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
        Student Access
      </span>
      <h2 className="text-3xl font-bold mb-2 text-dark">Let's Get Started</h2>
      <p className="text-neutral mb-8">
        Enter your full name to join the session.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-sm"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-white p-4 rounded-xl mb-4 border-2 border-gray-100 focus:border-primary focus:outline-none transition-colors text-lg text-center shadow-sm"
          placeholder="Ex. Rahul Bajaj"
          autoFocus
        />
        <Button type="submit" className="w-full py-4" disabled={!input.trim()}>
          Continue
        </Button>
      </form>
    </div>
  );
};

export default NameEntry;
