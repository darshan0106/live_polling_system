class MemoryStore {
  constructor() {
    this.teacherId = null;
    this.students = {}; // { socketId: { id, name } }
    this.polls = []; // History of polls
    this.currentPoll = null; // { id, question, options, timeLimit, timeLeft, active, totalVotes }
    this.timerInterval = null;
  }
}

module.exports = new MemoryStore();
