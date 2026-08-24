# CareerConnect AI – AI Career & Preparation Platform

CareerConnect AI is a full-stack AI-powered career preparation platform designed to help students and job seekers prepare for technical interviews, improve resumes, analyze job descriptions, practice coding and aptitude questions, and build personalized career roadmaps.

The application is built using React, Vite, Node.js, Express, MongoDB, and Google's Gemini AI.

---

## 🚀 Key Features

- 🔐 **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Protected user sessions

- 📊 **Career Dashboard**
  - Career readiness overview
  - Practice progress
  - Interview preparation tracking
  - Activity history

- 📄 **AI Resume Builder**
  - Build and update resumes
  - Resume optimization
  - ATS-focused suggestions
  - Resume improvement recommendations

- 🤖 **AI Career Coach**
  - Interactive AI-powered career guidance
  - Interview preparation
  - Career-related questions and suggestions
  - Personalized learning guidance

- 🗺️ **Career Roadmap**
  - Personalized career roadmap
  - Target role-based milestones
  - Skill development guidance

- 🎯 **Job Description Analyzer**
  - Analyze job descriptions
  - Identify required skills
  - Compare skills with career goals
  - Provide improvement suggestions

- 💻 **Coding Practice**
  - Coding questions
  - Topic-based practice
  - Coding history
  - Practice statistics

- 🧠 **Aptitude Practice**
  - Quantitative aptitude questions
  - Practice sessions
  - Randomized questions

- 🎤 **Mock Interviews**
  - Practice interview sessions
  - Interview questions
  - AI-based interview evaluation
  - Interview reports

- 👤 **Profile & Settings**
  - User profile management
  - Career preferences
  - Application settings
  - Notification management

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Context API

### Backend

- Node.js
- Express.js
- CORS
- JWT Authentication

### Database

- MongoDB
- Mongoose

### AI

- Google Gemini API

### Development Tools

- npm
- Git
- GitHub

---

## 📁 Project Structure

```text
CareerConnect-AI/
│
├── backend/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── index.html
│
├── package.json
├── vite.config.js
├── .env
└── README.md
```


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
    GEMINI_API_KEY=your_gemini_api_key
    MONGODB_URI=your_mongodb_connection_string
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

---

## 🔒 Security

Sensitive credentials are managed using environment variables.

Never commit the following files or information to GitHub:

- Gemini API keys
- MongoDB passwords or connection strings
- JWT secrets
- `.env` files
- Private API credentials

The `.env` file is excluded from Git using `.gitignore`.

For sharing the required environment variable structure, use `.env.example` with placeholder values only.


# CareerConnect AI

[🚀 **Live Demo**](https://careerconnect-ai-1.onrender.com)
