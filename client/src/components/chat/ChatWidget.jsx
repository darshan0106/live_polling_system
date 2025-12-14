import React, { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../../socket";
import clsx from "clsx";

export const ChatWidget = ({ userName, isTeacher }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [activeTab, setActiveTab] = useState("chat");

  const { messages, participants } = useSelector((state) => state.ui);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;

    socket.emit("chat:send", {
      text: msgText,
      sender: userName,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    setMsgText("");
  };

  const kickStudent = (id) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      socket.emit("kick:student", id);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-80 h-96 flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-white border-b flex p-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={clsx(
                "flex-1 py-2 text-sm font-bold rounded-md",
                activeTab === "chat"
                  ? "bg-gray-100 text-primary"
                  : "text-neutral"
              )}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={clsx(
                "flex-1 py-2 text-sm font-bold rounded-md",
                activeTab === "participants"
                  ? "bg-gray-100 text-primary"
                  : "text-neutral"
              )}
            >
              Participants ({participants.length})
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 scrollbar-thin">
            {activeTab === "chat" ? (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "flex flex-col",
                      m.sender === userName ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={clsx(
                        "max-w-[85%] rounded-lg p-2 text-sm shadow-sm",
                        m.sender === userName
                          ? "bg-primary text-white"
                          : "bg-white border"
                      )}
                    >
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {m.sender} • {m.time}
                    </span>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center text-xs text-gray-400 mt-10">
                    No messages yet.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-white p-2 rounded border shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">
                        {p.name} {p.name === userName && "(You)"}
                      </span>
                    </div>
                    {isTeacher && p.id !== socket.id && (
                      <button
                        onClick={() => kickStudent(p.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Kick
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area (Only for Chat) */}
          {activeTab === "chat" && (
            <form
              onSubmit={sendMessage}
              className="p-3 bg-white border-t flex gap-2"
            >
              <input
                className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Type a message..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary text-white p-2 rounded-full hover:bg-primary"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
