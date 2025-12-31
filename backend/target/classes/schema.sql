-- Drop tables if they exist to start fresh (for dev)
DROP TABLE IF EXISTS submission_results;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS test_cases;
DROP TABLE IF EXISTS problems;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- 'ROLE_ADMIN', 'ROLE_EXAMINER', 'ROLE_CANDIDATE'
);

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100)
);

-- Problems Table
CREATE TABLE problems (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL, -- Markdown/HTML content
    difficulty VARCHAR(20) DEFAULT 'MEDIUM', -- EASY, MEDIUM, HARD
    time_limit_ms INTEGER DEFAULT 1000, -- in milliseconds
    memory_limit_mb INTEGER DEFAULT 256, -- in megabytes
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Test Cases Table (One-to-Many with Problems)
CREATE TABLE test_cases (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT REFERENCES problems(id) ON DELETE CASCADE,
    input_data TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT TRUE, -- True for evaluation cases, False for sample cases
    weightage INTEGER DEFAULT 1 -- Score weight
);

-- Submissions Table
CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    problem_id BIGINT REFERENCES problems(id),
    language VARCHAR(20) NOT NULL, -- 'C', 'CPP', 'JAVA', 'PYTHON'
    code TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, ERROR
    verdict VARCHAR(50), -- ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR
    score INTEGER DEFAULT 0, -- Total score based on passed test cases
    execution_time_ms INTEGER, -- Max time taken
    memory_used_kb INTEGER, -- Max memory used
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submission Results (Detailed result per test case)
CREATE TABLE submission_results (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id BIGINT REFERENCES test_cases(id),
    status VARCHAR(50), -- PASSED, FAILED
    execution_time_ms INTEGER,
    memory_used_kb INTEGER,
    output TEXT -- Captured output (truncated if too long)
);

-- Initial Roles Data
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_EXAMINER'), ('ROLE_CANDIDATE') ON CONFLICT DO NOTHING;

-- Initial Admin User (password: admin123 - needs to be hashed in real app, using placeholder for now)
INSERT INTO users (username, email, password_hash, role_id, full_name) 
VALUES ('admin', 'admin@codejudge.com', '$2a$10$NotARealHashJustPlaceholder', 1, 'System Admin') 
ON CONFLICT DO NOTHING;
