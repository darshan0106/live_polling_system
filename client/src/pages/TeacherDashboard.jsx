import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { PollCard } from "../components/poll/PollCard";
import { Button } from "../components/common/Button";
import clsx from "clsx";

export default function TeacherDashboard() {
  const { currentPoll, history } = useSelector((state) => state.poll);
  const [view, setView] = useState("create"); // 'create' | 'history'

  // Controls when to show the "Create Form" vs "Live/Result View"
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState(60);

  // Auto-switch to Live View when a poll starts
  useEffect(() => {
    if (currentPoll?.active) {
      setIsCreating(false);
    }
  }, [currentPoll?.active]);

  const handleCreate = () => {
    const validOptions = options.filter((o) => o.text.trim());
    if (!question || validOptions.length < 2) return;

    socket.emit("poll:create", {
      question,
      options: validOptions.map((o) => o.text),
      timeLimit,
    });

    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectSelect = (index, isCorrect) => {
    const newOptions = [...options];
    if (isCorrect) {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index].isCorrect = false;
    }
    setOptions(newOptions);
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm min-h-150 p-8 mt-8">
      <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
        Intervue Poll
      </span>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-dark">Teacher Dashboard</h2>
        <div className="space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("create")}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-bold transition",
              view === "create"
                ? "bg-white text-primary shadow-sm"
                : "text-neutral"
            )}
          >
            Active Poll
          </button>
          <button
            onClick={() => setView("history")}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-bold transition",
              view === "history"
                ? "bg-white text-primary shadow-sm"
                : "text-neutral"
            )}
          >
            History
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="animate-fade-in">
        {view === "history" ? (
          <HistoryList history={history} />
        ) : isCreating || !currentPoll ? (
          <CreateForm
            question={question}
            setQuestion={setQuestion}
            options={options}
            handleOptionChange={handleOptionChange}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            addOption={addOption}
            handleCreate={handleCreate}
            handleCorrectSelect={handleCorrectSelect}
          />
        ) : (
          <div className="flex flex-col items-center w-full">
            <PollCard isTeacher={true} />

            {/* "Ask New" button appears only when poll ends */}
            {!currentPoll.active && (
              <button
                onClick={() => setIsCreating(true)}
                className="mt-8 bg-secondary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary transition-transform transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                + Ask a new question
              </button>
            )}

            {currentPoll.active && (
              <p className="mt-6 text-neutral text-sm">
                Wait for timer to end or poll to finish.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const CreateForm = ({
  question,
  setQuestion,
  options,
  handleOptionChange,
  timeLimit,
  setTimeLimit,
  addOption,
  handleCreate,
  handleCorrectSelect,
}) => (
  <div className="max-w-3xl mx-auto">
    <h3 className="text-2xl font-bold mb-6">Let's Get Started</h3>
    <p className="text-neutral text-sm mb-6 max-w-lg">
      You'll have the ability to create and manage polls, ask questions, and
      monitor your students' responses in real-time.
    </p>

    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-dark">
          Enter your question
        </label>
        <div className="relative">
          <select
            className="bg-gray-100 text-sm font-bold text-dark rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none pr-8"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
        </div>
      </div>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full bg-gray-50 p-4 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition resize-none"
        rows="3"
        placeholder="Type your question here..."
        maxLength={100}
      />
      <div className="text-right text-xs text-neutral mt-1">
        {question.length}/100
      </div>
    </div>

    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-bold text-dark w-2/3">
          Edit Options
        </label>
        <label className="block text-sm font-bold text-dark w-1/3 pl-4">
          Is it Correct?
        </label>
      </div>

      <div className="space-y-3">
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {i + 1}
            </div>
            <input
              value={o.text}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="grow bg-gray-50 p-3 rounded-lg border border-transparent focus:bg-white focus:border-primary focus:outline-none transition"
              placeholder={`Option ${i + 1}`}
            />
            <div className="shrink-0 w-1/3 flex items-center gap-4 pl-4">
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={o.isCorrect}
                  onChange={() => handleCorrectSelect(i, true)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm font-medium text-dark">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={!o.isCorrect}
                  onChange={() => handleCorrectSelect(i, false)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm font-medium text-dark">No</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addOption}
        className="mt-4 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-colors"
      >
        + Add More option
      </button>
    </div>

    <div className="flex justify-end pt-8 border-t border-gray-100">
      <Button onClick={handleCreate} className="px-10 py-3">
        Ask Question
      </Button>
    </div>
  </div>
);

// Updated History List with "Question 1, 2, 3..." headers
const HistoryList = ({ history }) => (
  <div className="space-y-8">
    {history.length === 0 && (
      <div className="text-center text-neutral py-10">
        No polls conducted yet.
      </div>
    )}
    {history.map((h, i) => (
      <div key={i} className="animate-fade-in">
        {/* Question Header */}
        <h3 className="font-bold text-xl mb-3 text-dark">Question {i + 1}</h3>

        <div className="border border-gray-100 rounded-xl p-6 shadow-sm bg-white">
          <div className="flex justify-between mb-4">
            <h4 className="font-bold text-lg">{h.question}</h4>
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-neutral font-medium border border-gray-200">
              Ended
            </span>
          </div>
          <div className="space-y-2">
            {h.options.map((opt, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm bg-gray-50 p-4 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-neutral text-xs flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium text-dark">{opt.text}</span>
                </div>
                <span className="font-bold text-primary">
                  {opt.votes} votes
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);
