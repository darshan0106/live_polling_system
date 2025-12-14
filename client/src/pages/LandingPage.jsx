import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket";
import { setUser, setRole } from "../store/uiSlice";
import clsx from "clsx";

const LandingPage = () => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) return;

    if (selectedRole === "teacher") {
      dispatch(setUser({ role: "teacher", name: "Teacher" }));
      socket.emit("join:teacher");
    } else {
      dispatch(setRole("student_pending"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-4xl w-full text-center">
        {/* Badge */}
        <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
          Intervue Poll
        </span>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-dark">
          Welcome to the Live Polling System
        </h1>
        <p className="text-neutral mb-10 text-base max-w-xl mx-auto">
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-10">
          <RoleCard
            title="I'm a Student"
            desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
            isSelected={selectedRole === "student"}
            onClick={() => setSelectedRole("student")}
          />
          <RoleCard
            title="I'm a Teacher"
            desc="Submit answers and view live poll results in real-time."
            isSelected={selectedRole === "teacher"}
            onClick={() => setSelectedRole("teacher")}
          />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={clsx(
            "px-12 py-3 rounded-full font-bold text-white transition-all duration-200 shadow-lg",
            selectedRole
              ? "bg-secondary hover:bg-primary hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed shadow-none"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// Reusable Card Component
const RoleCard = ({ title, desc, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      "w-full md:w-80 p-8 rounded-lg border-2 text-left cursor-pointer transition-all duration-200",
      isSelected
        ? "border-secondary shadow-md bg-white"
        : "border-gray-200 hover:border-gray-300 bg-white"
    )}
  >
    <h3 className="text-xl font-bold mb-3 text-dark">{title}</h3>
    <p className="text-neutral text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
