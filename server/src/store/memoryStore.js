class MemoryStore {
  constructor() {
    this.teacherId = null;
    this.students = {};
    this.polls = [];
    this.currentPoll = null;
    this.timerInterval = null;
  }
}

module.exports = new MemoryStore();
