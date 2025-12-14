import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { markVoted } from "../store/pollSlice";
import { PollCard } from "../components/poll/PollCard";
import { Button } from "../components/common/Button";

const StudentDashboard = () => {
  const { currentPoll, hasVoted } = useSelector((state) => state.poll);
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      socket.emit("poll:vote", selectedOption);
      dispatch(markVoted());
      setSelectedOption(null);
    }
  };

  // State 1: No Poll Active
  if (!currentPoll || (!currentPoll.active && !currentPoll.id)) {
    return <WaitingScreen message="Wait for the teacher to ask a question.." />;
  }

  // State 2: Active Poll or Viewing Results
  return (
    <div className="w-full max-w-4xl mt-10 px-4 flex flex-col items-center">
      <PollCard
        onVote={handleSelectOption}
        selectedOption={selectedOption}
        isTeacher={false}
      />

      {/* Show Submit Button Only when Active & Not Voted */}
      {!hasVoted && currentPoll.active && (
        <div className="w-full max-w-3xl flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-10 py-2.5"
          >
            Submit
          </Button>
        </div>
      )}

      {hasVoted && currentPoll.active && (
        <div className="text-center mt-6 animate-pulse text-primary font-medium">
          Answer Submitted! Waiting for results...
        </div>
      )}
    </div>
  );
};

const WaitingScreen = ({ message }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm w-full max-w-4xl mt-10 p-10 text-center">
    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
      Intervue Poll
    </span>
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
    <h2 className="text-2xl font-bold text-dark mb-2">{message}</h2>
    <p className="text-neutral">
      Stay tuned! The question will appear here automatically.
    </p>
  </div>
);

export default StudentDashboard;
