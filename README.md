# Intervue Poll – Live Polling System

An end-to-end **Real-Time Polling application** that allows teachers to create polls instantly and students to vote in real time without refreshing their browsers.

This project demonstrates real-time communication using WebSockets and a clean separation of Teacher and Student workflows.

---

## 📌 Project Overview

The project includes:

- A **Node.js & Socket.io backend** for handling real-time WebSocket connections, room management, timers, and event broadcasting.
- A **React frontend** where teachers can manage sessions and students can interactively vote on polls.

---

## ⭐ Features

### Core Features

- **Real-Time Communication**: Instant updates for polls, votes, and timer synchronization using WebSockets.
- **Live Results**: Dynamic progress bars that update instantly as students vote.
- **Poll History**: View a list of past polls with their final vote counts.

### Teacher Dashboard

- Create polls with multiple options.
- Set time limits (10s, 30s, 60s).
- Enable **Quiz Mode** by marking a correct answer.
- View connected participants.
- Kick participants if needed.

### Student Dashboard

- Join without authentication (name-based).
- "Select then Submit" workflow to prevent accidental voting.
- View final results once the timer ends.

---

## 🧠 Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **Socket.io**
- **In-Memory Store** (JavaScript Objects)

### Frontend / UI

- **React (Vite)**
- **Redux Toolkit** (State Management)
- **Tailwind CSS** (Styling)
- **Socket.io-client**

---

## 📘 System Architecture

The system uses a **Client–Server architecture** powered by WebSockets.

### Clients

- **Teacher Client**

  - Emits `poll:create`
  - Listens for `poll:updated` and `participants:update`

- **Student Client**
  - Listens for `poll:started`
  - Emits `poll:vote`

### Server

- Acts as the **Source of Truth**
- Stores:
  - Current poll state
  - Timer
  - Participants
- Broadcasts updates to all connected clients in real time

---

## 🔧 Application Flow

### 1️⃣ Session Initialization

- Teacher joins and initializes the session.
- Students enter their names and wait in the lobby.

### 2️⃣ Poll Creation

- Teacher sets a question, options, and timer.
- Server broadcasts the poll to all students immediately.

### 3️⃣ Voting Process

- Students select an option and click **Submit**.
- Server validates the vote and increments the count.
- Updated percentages are sent to the teacher in real time.

### 4️⃣ Poll Conclusion

- Poll automatically closes when the timer reaches `0`.
- Results are revealed to students.
- Poll data is saved in session history.

---

## 🚀 How to Run the Project

### 🔹 1. Setup & Start Backend

```bash
cd server
npm install
node index.js
```

The server start on

```
http://localhost:5000
```

### 🔹 2. Setup & Start Frontend

```bash
cd client
npm install
npm run dev
```

### 🔹 2. Setup & Start Frontend

Open the URL displayed in the terminal:

```
http://localhost:5173/
```

---

## 📂 Project Structure

```
│── server/
│   │── src/
│   │   │── handlers/        # Socket event handlers (business logic)
│   │   │── store/           # In-memory database
│   │── index.js             # Server entry point
│   │── package.json
│
│── client/
│   │── src/
│   │   │── components/      # Reusable UI (PollCard, Button)
│   │   │── pages/           # Teacher & Student Dashboards
│   │   │── store/           # Redux Slices (pollSlice, uiSlice)
│   │   │── socket.js        # Socket instance
│   │   │── App.jsx          # Main Routing
│   │── tailwind.config.js   # Style config
│   │── package.json
│
│── README.md                # Project documentation
```

---

## 🧪 Usage Instructions

1. Teacher Role:

   - Open the app and select "I'm a Teacher".
   - Create a question (e.g., "What is the capital of France?").
   - Set options and mark one as correct.
   - Click Ask Question.

2. Student Role:

   - Open the app in a new window/tab.
   - Select "I'm a Student" and enter your name.
   - Wait for the question to appear.
   - Select an option and click Submit.

3. View Results:

   - Watch the progress bars on the Teacher's screen update in real-time.
   - Once the timer ends, students will see the final results.

---

## 🔮 Future Improvements

- Integrate **MongoDB** for persistent storage of poll history.
- Add **Authentication** (Google/Email login) for teachers.
- Implement **Multiple Rooms** to support multiple classes simultaneously.
- Add **Export to CSV** feature for poll results.
- Deploy the app on **Vercel (Frontend) and Render (Backend).**

---

## 🌐 Deployed Application

You can access the live site here:
**[https://vercel.com/darshan0106s-projects/live-polling-system/FeHsD2dxo6cRABJRoJ3QsvJzYpVW](https://live-polling-system-orpin-delta.vercel.app/)**

---

## 📜 License

This project is free to use for learning and academic purposes.
