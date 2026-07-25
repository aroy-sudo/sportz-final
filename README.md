# 🏆 Sportz - Real-Time Live Dashboard

Sportz is a full-stack, real-time sports dashboard and administrative control panel. It features a robust Node.js backend utilizing native WebSockets for instant updates and a beautifully designed, modern frontend dashboard built with Next.js and Tailwind CSS.

## 🚀 Architecture Overview

The project is split into two main components:
- **Frontend (`/sportz-frontend`)**: Next.js App Router, React, Tailwind CSS (v4), SWR, and Lucide React.
- **Backend (`/sportz-websockets`)**: Node.js, Express, WebSockets (`ws`), PostgreSQL (via Drizzle ORM), and Arcjet (for WebSocket security & rate limiting).

## 📂 Project Structure

```
sportz-final/
├── sportz-frontend/       # User-facing Next.js application & Admin dashboard
└── sportz-websockets/     # Backend REST API and WebSocket server
```

## ⚡ Features

- **Real-Time Updates**: Live match scores and play-by-play commentary broadcast instantly to connected clients via WebSockets.
- **Live Match Controller (Admin)**: A dedicated `/admin` dashboard allowing administrators to schedule matches, update live scores instantly, and post granular commentary events.
- **Dynamic Commentary Feed**: An auto-scrolling feed mapping distinct sports events (goals, red cards, fouls) to unique visual UI cues.
- **Premium UI/UX**: Features a highly polished dark mode, glassmorphism components, custom dynamic gradients, and smooth micro-animations.

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [PostgreSQL](https://www.postgresql.org/) Database

### 1. Backend Setup (`sportz-websockets`)

1. Navigate to the backend directory:
   ```bash
   cd sportz-websockets
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Ensure your environment variables are configured (e.g., PostgreSQL connection string, Arcjet keys) in a `.env` file.
4. Apply database migrations:
   ```bash
   npm run db:migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   *The REST API runs on `http://localhost:8000` and the WebSocket endpoint is accessible at `ws://localhost:8000/ws`.*

### 2. Frontend Setup (`sportz-frontend`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd sportz-frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configure your local environment by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the live dashboard.
6. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to manage matches.

---

## 🔒 Security

WebSocket endpoints are protected by **Arcjet**, ensuring built-in rate-limiting and shielding the real-time servers against abuse. Ensure valid API keys are configured in your backend environment if Arcjet protection is enforced globally.
