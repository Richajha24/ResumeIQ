# ResumeIQ — AI-Powered Resume Analyzer & ATS Score Checker

> AI-Powered Resume Analyzer & ATS Score Checker

ResumeIQ evaluates how effectively a candidate's resume matches a target job description. The application parses resume documents (PDF/DOCX), compares key qualifications against job specifications using AI, generates an overall ATS Compatibility Score, highlights critical skill gaps and formatting errors, provides personalized actionable suggestions, exports formatted PDF reports, and maintains complete historical records.

---

## Technical Stack & Architecture

- **Frontend**: React.js (Vite), React Router DOM, Lucide Icons, Custom CSS Design Tokens matching the presentation identity (`#F3EBDD`, `#2F4034`, `#A43D35`, `#D6A83D`, `#FAF7EF`).
- **Backend**: Node.js, Express.js REST API.
- **Database**: MongoDB & Mongoose (with built-in memory fallback store for zero-config local execution).
- **AI Analysis**: OpenAI API (`gpt-4o-mini` / `gpt-3.5-turbo`) with structured JSON schema output and intelligent heuristic fallback engine.
- **Authentication**: JWT (JSON Web Tokens) with role-based access control (`candidate` / `admin`).
- **File Upload & Parsing**: Multer middleware with `pdf-parse` (PDF) and `mammoth` (DOCX).
- **Report Generation**: `pdfkit` styled with ResumeIQ brand palette.

---

## Project Structure

```
ResumeIQ/
├── server/
│   ├── config/             # DB connection & memory store
│   ├── controllers/        # Auth, Resume, Analysis, Report, Admin logic
│   ├── middleware/         # JWT auth guard, Admin guard, Multer file upload
│   ├── models/             # User, Resume, JobDescription, Analysis, Report schemas
│   ├── routes/             # Express API router endpoints
│   ├── services/           # AI engine, PDF/DOCX parser, PDFkit report generator
│   ├── package.json
│   └── index.js            # Express server entry point
├── client/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Card, ScoreCircle, StepIndicator, Badge, LoadingState
│   │   ├── context/        # AuthContext for session management
│   │   ├── pages/          # Landing, Login, Register, Dashboard, Wizard, Results, History, Admin
│   │   ├── App.jsx         # App router & protected route guards
│   │   ├── index.css       # ResumeIQ CSS design system
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── package.json            # Root scripts for running server and client concurrently
└── README.md
```

---

## Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (Optional: The application automatically initializes in-memory database storage if local MongoDB is not detected).

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root directory or configure environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumeiq
JWT_SECRET=resumeiq_super_secret_jwt_key_2026_production
OPENAI_API_KEY=your_openai_api_key_here
```

*(Note: If `OPENAI_API_KEY` is omitted or invalid, the backend automatically uses its smart fallback analysis engine so you can evaluate the full workflow instantly.)*

### 3. Installation
Install dependencies for all modules:

```bash
# Install root, server, and client dependencies
npm run install-all
```

Or install separately:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 4. Running Locally
Start both backend (Port 5000) and frontend (Port 3000) concurrently:

```bash
npm run dev
```

Access the application in your browser at:
`http://localhost:3000`

---

## Demo Accounts

Pre-seeded accounts are available out-of-the-box:

- **Candidate Account**:
  - **Email**: `candidate@resumeiq.com`
  - **Password**: `password123`

- **Admin Account**:
  - **Email**: `admin@resumeiq.com`
  - **Password**: `admin123`

---

## Core Workflow Steps

1. **Sign In / Register**: Authenticate using JWT.
2. **Dashboard**: View overall statistics and recent analyses.
3. **Upload Resume**: Drag & drop or browse PDF / DOCX file.
4. **Target Role & Job Description**: Input job title and paste position details.
5. **AI Analysis**: Backend parses text and evaluates ATS score, missing skills, and formatting.
6. **Results & Recommendations**: View semi-circular ATS score, metric breakdowns, missing skills chips, formatting red flags, and numbered recommendations.
7. **Export PDF Report**: Download a formatted PDF report.
