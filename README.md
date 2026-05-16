# Resume Analyzer - AI-Powered Resume Analysis System

![Resume Analyzer](https://img.shields.io/badge/Resume-Analyzer-blue?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.13-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.3_70B-purple?style=for-the-badge)

> **Know your ATS score before the recruiter does.**

An AI-powered full-stack web application that analyzes resumes against specific job roles and provides instant ATS scores, skill gap analysis, and personalized improvement suggestions.

---

## Live Demo

- **Frontend:** https://resume-analyzer-sand-iota.vercel.app
- **Backend API:** https://resume-analyzer-backend-v7iu.onrender.com

---

## Features

- **JWT Authentication** - Secure register/login with role-based access (USER and HR)
- **PDF Resume Upload** - Drag-and-drop PDF upload with automatic text extraction
- **AI-Powered Analysis** - Groq AI (LLaMA 3.3 70B) analyzes resume against job role
- **ATS Score** - Score out of 100 with 5-category breakdown
- **Skill Matching** - Identifies matched and missing skills
- **AI Suggestions** - Personalized improvement tips
- **Analysis History** - Track all previous analyses
- **HR Dashboard** - Bulk resume upload and batch analysis
- **Candidate Leaderboard** - Rank candidates by ATS score with medal system
- **Toast Notifications** - Real-time feedback for all user actions

---

## Score Breakdown

| Category | Max Score |
|---|---|
| Skills Match | 40 |
| Projects | 20 |
| Education | 15 |
| Experience | 15 |
| Resume Format | 10 |
| **Total ATS Score** | **100** |

---

## Tech Stack

### Frontend
- React.js 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Java 21
- Spring Boot 3.5.13
- Spring Security + JWT (JJWT)
- Spring Data JPA + Hibernate
- Apache PDFBox 3.0.1

### Database
- MySQL 8.0 (Railway)

### AI Engine
- Groq API - LLaMA 3.3 70B model

### Deployment
- Frontend: Vercel
- Backend: Render (Docker)
- Database: Railway MySQL

---

## Project Structure

```
resume-analyzer/
├── backend/
│   ├── src/main/java/com/resumeanalyzer/backend/
│   │   ├── config/
│   │   │   ├── JwtUtil.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── ResumeController.java
│   │   │   ├── AnalysisController.java
│   │   │   └── JobRoleController.java
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Resume.java
│   │   │   ├── JobRole.java
│   │   │   └── AnalysisResult.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ResumeRepository.java
│   │   │   ├── JobRoleRepository.java
│   │   │   └── AnalysisResultRepository.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── ResumeService.java
│   │       ├── AnalysisService.java
│   │       ├── JobRoleService.java
│   │       └── GeminiService.java
│   ├── src/main/resources/
│   │   └── application.properties (gitignored)
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── UploadPage.jsx
│       │   ├── ResultsPage.jsx
│       │   ├── HistoryPage.jsx
│       │   ├── HRDashboard.jsx
│       │   └── HRLeaderboard.jsx
│       ├── components/
│       │   └── Navbar.jsx
│       └── services/
│           └── api.js
└── docs/
    └── Resume_Analyzer_Synopsis.pdf
```

---

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'HR') NOT NULL DEFAULT 'USER',
    created_at DATETIME
);

-- Resumes Table
CREATE TABLE resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_path VARCHAR(255),
    extracted_text LONGTEXT,
    uploaded_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Job Roles Table
CREATE TABLE job_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    required_skills TEXT,
    created_at DATETIME
);

-- Analysis Results Table
CREATE TABLE analysis_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    resume_id BIGINT NOT NULL,
    job_role_id BIGINT NOT NULL,
    ats_score INT,
    matched_skills TEXT,
    missing_skills TEXT,
    suggestions TEXT,
    created_at DATETIME,
    FOREIGN KEY (resume_id) REFERENCES resumes(id),
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id)
);
```

---

## Getting Started Locally

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8.0
- Maven

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/gauravbhore33/resume-analyzer.git
cd resume-analyzer/backend
```

2. Create MySQL database
```sql
CREATE DATABASE resume_analyzer;
```

3. Create `application.properties` in `src/main/resources/`
```properties
spring.application.name=backend
spring.datasource.url=jdbc:mysql://localhost:3306/resume_analyzer
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
jwt.secret=resumeAnalyzerSecretKey2024VeryLongSecretKeyForSecurity
jwt.expiration=86400000
groq.api.key=YOUR_GROQ_API_KEY
groq.api.url=https://api.groq.com/openai/v1/chat/completions
```

4. Run the backend
```bash
./mvnw spring-boot:run
```

### Frontend Setup

1. Navigate to frontend folder
```bash
cd resume-analyzer/frontend
```

2. Install dependencies
```bash
npm install
```

3. Update API URL in `src/services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

4. Run the frontend
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and get JWT token |
| POST | /api/resume/upload | Upload PDF resume |
| POST | /api/resume/analyze | Trigger AI analysis |
| GET | /api/resume/result/{id} | Get analysis result |
| GET | /api/resume/results/{resumeId} | Get all results for resume |
| GET | /api/resume/leaderboard/{jobRoleId} | Get HR leaderboard |
| GET | /api/jobs/roles | Get all job roles |
| POST | /api/jobs/roles | Create job role |

---

## Deployment

### Backend (Render + Docker)

The backend is containerized using Docker and deployed on Render.

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw
RUN ./mvnw clean install -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Environment Variables (Render)

| Variable | Description |
|---|---|
| SPRING_DATASOURCE_URL | MySQL connection URL |
| SPRING_DATASOURCE_USERNAME | Database username |
| SPRING_DATASOURCE_PASSWORD | Database password |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRATION | Token expiry in ms |
| GROQ_API_KEY | Groq API key |
| GROQ_API_URL | Groq API endpoint |

### Frontend (Vercel)

Connect your GitHub repository to Vercel and set the root directory to `frontend`.

---

## Available Job Roles

- Java Developer
- React Developer
- Full Stack Developer
- Data Analyst
- Python Developer
- Android Developer
- DevOps Engineer
- Machine Learning Engineer
- UI/UX Designer

---

## Screenshots



| Landing Page | Upload Page |
|---|---|
| [c:\Users\Gaurav\Pictures\Screenshots\Screenshot 2026-05-09 151533.png] | [c:\Users\Gaurav\Pictures\Screenshots\Screenshot 2026-05-09 151858.png] |

| Results Page | HR Dashboard |
|---|---|
| [c:\Users\Gaurav\Pictures\Screenshots\Screenshot 2026-05-09 151939.png] | [c:\Users\Gaurav\Pictures\Screenshots\Screenshot 2026-04-15 203652.png] |

---

## Author

**Gaurav Muniraj Bhore**
- Roll No: 09
- MCA-I
- JSPM's Jayawantrao Sawant College of Engineering, Pune
- GitHub: [@gauravbhore33](https://github.com/gauravbhore33)

---

## Acknowledgements

- [Groq AI](https://groq.com) for the LLaMA 3.3 70B API
- [Apache PDFBox](https://pdfbox.apache.org) for PDF text extraction
- [Spring Boot](https://spring.io/projects/spring-boot) for the backend framework
- [React](https://react.dev) for the frontend framework
- [Render](https://render.com) for backend hosting
- [Vercel](https://vercel.com) for frontend hosting
- [Railway](https://railway.app) for MySQL hosting

---

*Built with Java, Spring Boot, React.js, MySQL, and Groq AI*
