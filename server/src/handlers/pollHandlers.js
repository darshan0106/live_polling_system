const store = require("../store/memoryStore");

module.exports = (io, socket) => {
  // Create a new poll (Teacher only)
  const createPoll = ({ question, options, timeLimit }) => {
    // Prevent creating if one is already active
    if (store.currentPoll?.active) return;

    store.currentPoll = {
      id: Date.now(),
      question,
      options: options.map((text) => ({ text, votes: 0 })),
      timeLimit,
      timeLeft: timeLimit,
      active: true,
      totalVotes: 0,
    };

    io.emit("poll:started", store.currentPoll);

    // Reset and Start Timer
    if (store.timerInterval) clearInterval(store.timerInterval);

    store.timerInterval = setInterval(() => {
      if (store.currentPoll && store.currentPoll.active) {
        store.currentPoll.timeLeft -= 1;
        io.emit("poll:timer", store.currentPoll.timeLeft);

        if (store.currentPoll.timeLeft <= 0) {
          endPoll();
        }
      } else {
        clearInterval(store.timerInterval);
      }
    }, 1000);
  };

  // End the poll manually or automatically
  const endPoll = () => {
    clearInterval(store.timerInterval);
    if (store.currentPoll) {
      store.currentPoll.active = false;
      store.polls.push(store.currentPoll);
      io.emit("poll:ended", store.currentPoll);
    }
  };

  // Handle incoming votes
  const submitVote = (optionIndex) => {
    if (!store.currentPoll || !store.currentPoll.active) return;

    if (store.currentPoll.options[optionIndex]) {
      store.currentPoll.options[optionIndex].votes += 1;
      store.currentPoll.totalVotes += 1;

      // Broadcast updated results immediately
      io.emit("poll:updated", store.currentPoll);
    }
  };

  socket.on("poll:create", createPoll);
  socket.on("poll:vote", submitVote);
};
