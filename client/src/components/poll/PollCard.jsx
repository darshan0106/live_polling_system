import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

// Added selectedOption prop here
export const PollCard = ({ onVote, isTeacher, selectedOption }) => {
  const { currentPoll, hasVoted } = useSelector((state) => state.poll);

  if (!currentPoll) return null;

  const { question, options, timeLeft, active, totalVotes } = currentPoll;

  // Show results logic remains the same
  const showResults = isTeacher || hasVoted || timeLeft === 0 || !active;

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 className="font-bold text-lg text-dark">Question 1</h3>
        <span
          className={clsx(
            "font-bold font-mono",
            timeLeft < 10 ? "text-red-500" : "text-dark"
          )}
        >
          {active ? `⏱ 00:${String(timeLeft).padStart(2, "0")}` : "Ended"}
        </span>
      </div>

      {/* Question Body */}
      <div className="bg-dark text-white p-8">
        <h2 className="text-xl font-medium leading-relaxed">{question}</h2>
      </div>

      {/* Options List */}
      <div className="p-6 space-y-4">
        {options.map((opt, idx) => {
          const percentage =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const letter = String.fromCharCode(65 + idx);

          // Check if this specific option is selected (Local state)
          const isSelected = selectedOption === idx;

          return (
            <button
              key={idx}
              // Allow clicking if active and not yet voted
              disabled={isTeacher || hasVoted || !active || timeLeft === 0}
              onClick={() => onVote && onVote(idx)}
              className={clsx(
                "relative w-full h-14 rounded-lg border overflow-hidden text-left group transition-all",
                hasVoted
                  ? "cursor-default border-gray-200" // Voted state
                  : isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary" // Selected but not submitted (Purple highlight)
                  : "border-gray-200 hover:border-secondary hover:bg-gray-50" // Default hover state
              )}
            >
              {/* Result Bar Background */}
              {showResults && (
                <div
                  className="absolute top-0 left-0 h-full bg-secondary/10 transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Solid Indicator Bar */}
              {showResults && (
                <div
                  className="absolute top-0 left-0 h-full bg-secondary w-1.5 transition-all duration-700"
                  style={{ left: `${percentage}%` }}
                />
              )}

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                  <span
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                      showResults
                        ? "bg-secondary text-white"
                        : isSelected
                        ? "bg-primary text-white" // Purple badge when selected
                        : "bg-gray-200 text-gray-600 group-hover:bg-secondary group-hover:text-white"
                    )}
                  >
                    {letter}
                  </span>
                  <span className="font-medium text-dark text-base">
                    {opt.text}
                  </span>
                </div>
                {showResults && (
                  <span className="font-bold text-secondary text-lg">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 pb-6 text-center text-sm text-neutral border-t border-gray-50 pt-4">
        {isTeacher
          ? "Live results are shown above."
          : hasVoted
          ? "You have submitted your answer."
          : "Select an option and click Submit."}
      </div>
    </div>
  );
};
