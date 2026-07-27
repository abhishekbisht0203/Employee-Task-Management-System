-- Employee Task Management System - Database Schema
-- PostgreSQL DDL

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to BIGINT NOT NULL REFERENCES users(id),
    assigned_by BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    due_date DATE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_logs (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL REFERENCES tasks(id),
    employee_id BIGINT NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    status_at_log VARCHAR(20),
    logged_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_work_logs_task_id ON work_logs(task_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Seed data: pre-loaded credentials for evaluation
INSERT INTO users (full_name, email, password, role, department, is_active)
VALUES
    ('Admin User', 'admin@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'ADMIN', NULL, TRUE),
    ('John Doe', 'employee@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.zkQcx7MBMXCp4mpNj/8D3u1Z4nWqx.y', 'EMPLOYEE', 'Engineering', TRUE)
ON CONFLICT (email) DO NOTHING;
