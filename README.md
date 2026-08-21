# CareerPrep - AI Career & Preparation Platform

CareerPrep is an AI-driven career preparation platform designed to help candidates prepare for technical interviews, optimize resumes for ATS compatibility, map career growth paths, and track daily readiness metrics. Built with a modern full-stack architecture featuring React, Vite, Node.js, Express, and MongoDB.

---

## 🚀 Key Features

- 👤 **Dynamic Authentication & Global Session Management**: JWT token authentication with `AuthContext` state management, automatic session restoration via `GET /api/auth/me`, and protected route guards.
- 📊 **Database-Driven Dashboard**: Zero-state career readiness scoring, coding XP tracking, interview ranking, and real-time weekly activity graphs calculated per user.
- 📄 **ATS Resume Builder & Optimizer**: Live ATS scoring, keyword gap analysis, and AI suggestions for resume bullet formatting using Google's X-Y-Z formula.
- 🤖 **Interactive AI Coach**: Conversational coach providing guidance on STAR interview technique, recruiter salary negotiations, and skill gaps.
- 🗺️ **Custom Career Roadmap**: Automated generation of milestone timelines and focus areas tailored to target roles and target companies.
- 🎯 **Job Description (JD) Analyzer**: Match score analysis against target job postings with actionable skill recommendations.
- 💡 **Practice Drills & Coding Arena**: Timed contest drills, data structures, and quantitative aptitude sets that update user XP dynamically.
- 👤 **Profile & Settings Management**: Dynamic user brand settings, verified skills list, theme toggle (Light/Dark/System), and notification preferences.

---

## 📁 Project Structure

```text
CareerPrep/
├── backend/
│   ├── controllers/       # Controller handlers mapping routes to data store calls
│   │   └── controller.js
│   ├── data/              # Database storage layer and unit/integration tests
│   │   ├── store.js       # Multi-tenant user data isolation & zero-state store
│   │   ├── store.test.js  # Store unit tests
│   │   └── db.json        # Persistent local JSON data fallback
│   ├── middleware/        # Bearer token and user identity extraction middleware
│   │   └── authMiddleware.js
│   ├── models/            # Mongoose database models (User, Analytics, Profile, etc.)
│   │   └── index.js
│   ├── routes/            # Express REST API routes and automated integration tests
│   │   ├── apiRoutes.js
│   │   └── apiRoutes.test.js
│   └── server.js          # Express server entry point (Port 3001)
├── frontend/
│   ├── src/               # React SPA components and page layouts
│   │   ├── components/    # Reusable UI icons & layout modules
│   │   └── App.jsx        # AuthProvider, AppShell, Router, and Page views
│   ├── index.html         # Application HTML root template
│   └── vite.config.js     # Vite configuration
├── src/                   # Synced frontend source directory
├── .env                   # Environment variables configuration
├── package.json           # npm scripts and dependency manifest
└── README.md              # Project documentation
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS (Dark mode, glassmorphism, dynamic animations), Context API State Management.
- **Backend**: Node.js, Express, CORS, Custom Auth Middleware, Base64 JWT Tokens.
- **Database**: MongoDB (via Mongoose) with isolated per-user JSON fallback persistence.
- **Test Runner**: Native Node.js Test Suite (`node --test`).

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies in the project root:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/careerprep
   VITE_API_URL=http://localhost:3001/api
   ```

### Execution Scripts

- **Run Frontend (Development Server)**:
  ```bash
  npm run dev
  ```
  *App runs at: `http://localhost:5173`*

- **Run Backend API Server**:
  ```bash
  npm run start
  # or
  npm run server
  ```
  *API runs at: `http://localhost:3001/api`*

- **Run Test Suite**:
  ```bash
  npm test
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

---

## 🧪 Automated Testing

The project includes an automated unit and integration test suite verifying backend user isolation, zero-state metrics, REST API routes, and the `/api/auth/me` endpoint.

To execute tests:
```bash
npm test
```
