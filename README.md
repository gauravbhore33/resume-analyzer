# Resume Analyzer 🎯

An AI-powered Resume Analyzer built as MCA Placement Project.
It analyzes resumes against job roles and gives ATS score,
matched skills, missing skills and improvement suggestions.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Spring Boot (Java) + JWT |
| Database | MySQL |
| AI Engine | Claude API (Anthropic) |
| PDF Parsing | Apache PDFBox |

---

## ✨ Features

- ✅ User Registration & Login (JWT Auth)
- ✅ Upload PDF Resume
- ✅ Select Target Job Role
- ✅ ATS Score out of 100
- ✅ Matched Skills Analysis
- ✅ Missing Skills Detection
- ✅ AI-powered Improvement Suggestions
- ✅ Analysis History
- ✅ HR Module — Bulk Resume Ranking

---

## 🗂️ Project Structure




---

## 🗄️ Database Tables

| Table | Description |
|---|---|
| users | Stores user accounts and roles |
| resumes | Stores uploaded resume details |
| job_roles | Stores job roles with required skills |
| analysis_results | Stores AI analysis results |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| POST | /api/resume/upload | Upload resume |
| POST | /api/resume/analyze | Trigger AI analysis |
| GET | /api/resume/results/{id} | Get analysis result |
| GET | /api/jobs/roles | List all job roles |

---

## 🪜 Project Phases

- ✅ Phase 1 — Planning & Setup
- ⏳ Phase 2 — Backend Development
- ⏳ Phase 3 — AI Integration
- ⏳ Phase 4 — Frontend Development
- ⏳ Phase 5 — HR Module
- ⏳ Phase 6 — Testing & Deployment

---

## 👨‍💻 Developer

- **Name** — Gaurav Bhore
- **Course** — MCA
- **Project Type** — Placement Project