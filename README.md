# CodeJudge - Online Code Evaluation Platform

**CodeJudge** is a production-grade online code evaluation platform designed for technical hiring and campus placements. It features a secure, sandboxed execution environment, role-based access control, and plagiarism detection.

## 🏗 System Architecture

The project is structured as a **Modular Monolith** with a dedicated **Microservice** for code execution.

- **Frontend**: React, Tailwind CSS, Monaco Editor (located in `/frontend`)
- **Backend**: Java Spring Boot, Spring Security, JWT, JPA (located in `/backend`)
- **Database**: PostgreSQL
- **Execution Engine**: Isolated Docker-based sandbox service (located in `/execution-engine`)

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ (JDK)
- Node.js 18+

### Setup
1.  **Start Database**:
    ```bash
    docker-compose up -d
    ```

2.  **Backend**:
    - Navigate to `/backend`
    - Run `./mvnw spring-boot:run`

3.  **Frontend**:
    - Navigate to `/frontend`
    - Run `npm install` && `npm run dev`

### 🛠 Tech Stack
- **Frontend**: React, Tailwind, Axios
- **Backend**: Spring Boot, Hibernate, PostgreSQL
- **Ops**: Docker, Docker Compose
