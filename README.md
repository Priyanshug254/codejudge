# CodeJudge - Online Code Evaluation Platform

CodeJudge is a production-grade online coding platform similar to HackerRank or LeetCode. It allows users to solve algorithmic problems in real-time using a secure, sandboxed execution environment.

## 🚀 Features

### Core Platform
-   **Secure Authentication**: JWT-based signup and login system.
-   **Role-Based Access**: Specialized features for Candidates, Examiners, and Admins.
-   **Modern UI**: Responsive, dark-themed interface built with React and Tailwind CSS.

### Coding Challenges
-   **Problem Management**: Examiners can create problems with Markdown descriptions, constraints, and test cases.
-   **Problem Browser**: Candidates can filter and search through available coding challenges.

### Code Execution Engine
-   **Sandboxed Execution**: Calls a dedicated microservice that spins up isolated Docker containers for every submission.
-   **Multi-Language Support**: Currently supports **Java**, **Python**, and **C++**.
-   **Security**: Enforces time and memory limits to prevent abuse.

### Analytics & Gamification
-   **Real-time Leaderboard**: Global ranking based on problems solved and total score.
-   **User Profiles**: Personalized dashboard showing coding statistics and recent submission history.
-   **Verdict System**: Instant feedback on submissions (Accepted, Wrong Answer, Time Limit Exceeded, etc.).

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Monaco Editor, Axios.
-   **Backend**: Java Spring Boot, Spring Security, Spring Data JPA.
-   **Database**: PostgreSQL.
-   **Execution Engine**: Spring Boot + Docker (Orchestration).
-   **DevOps**: Docker Compose for local database orchestration.

## ⚙️ Setup Instructions

### Prerequisites
-   **Docker Desktop** (Must be running for DB and Execution Engine)
-   **Java JDK 17+**
-   **Node.js 18+**
-   **Maven**

### 1. Database Setup
Start the PostgreSQL container:
```bash
docker-compose up -d
```
*Credentials: `codejudge` / `password` (configured in `docker-compose.yml`)*

### 2. Backend Service
The main API service handles business logic and data persistence.
```bash
cd backend
mvn spring-boot:run
```
*Server runs on: `http://localhost:8080`*

### 3. Execution Engine
The microservice responsible for running user code safely.
```bash
cd execution-engine
mvn spring-boot:run
```
*Server runs on: `http://localhost:8081`*

### 4. Frontend Application
The user interface.
```bash
cd frontend
npm install
npm run dev
```
*App runs on: `http://localhost:5173`*

## 📖 Usage Guide

1.  **Register**: Create a new account at `/register`.
2.  **Dashboard**: You will be redirected to the Problem List.
3.  **Solve**: Click on a problem, write your code in the editor, and hit **Run** to test.
4.  **Submit**: Click **Submit** to run your code against hidden test cases.
5.  **Profile**: Check your profile to see your submission history and stats.
6.  **Leaderboard**: Visit the leaderboard to see how you stack up against others.

## 🤝 Contributing
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
Distributed under the MIT License.
