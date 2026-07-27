# Employee Task Management System — Project Plan

**Client:** EventXplora Pvt. Ltd. (Technical Assessment)
**Stack:** Spring Boot (backend) · React (frontend) · PostgreSQL (database) · JWT (auth)
**Deadline:** 3 days from receipt of assessment

This document breaks the assignment into concrete, buildable pieces so it can be handed to Claude/Claude Code section by section. Each section maps directly to a line in the original assessment PDF so nothing gets missed during evaluation or the interview walkthrough.

---

## 0. Ground Rules Before Starting

- [ ] Confirm Java version (17 or 21) and Spring Boot version (3.x) to use.
- [ ] Confirm Node version and whether to use Vite or CRA for React (Vite recommended — faster, modern).
- [ ] Decide on Postgres hosting for dev: local Postgres, Docker container, or a free cloud instance (Neon/Supabase) — useful if you want to demo without local setup during the interview.
- [ ] Create the GitHub repo first (private is fine, make public/invite HR before submission) — commit early and often so the history shows real incremental work, not one giant commit. Interviewers often check commit history.

---

## 1. Project Architecture & Folder Structure

**Goal:** "clean project structure" — this is explicitly graded.

```
employee-task-management/
├── backend/                     # Spring Boot project
│   ├── src/main/java/com/eventxplora/taskmanager/
│   │   ├── config/              # SecurityConfig, JwtConfig, CorsConfig, SwaggerConfig
│   │   ├── controller/          # REST controllers (AuthController, TaskController, EmployeeController, DashboardController)
│   │   ├── dto/                 # Request/Response DTOs (never expose entities directly)
│   │   ├── entity/               # JPA entities (User, Task, WorkLog, Role)
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── service/             # Business logic, interfaces + impl
│   │   ├── security/             # JwtUtil, JwtFilter, UserDetailsServiceImpl
│   │   ├── exception/            # GlobalExceptionHandler, custom exceptions
│   │   └── TaskManagerApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/         # Flyway SQL migration files (V1__init.sql, V2__seed.sql...)
│   └── pom.xml
├── frontend/                     # React (Vite)
│   ├── src/
│   │   ├── api/                  # axios instance + API call functions
│   │   ├── components/           # Reusable UI (Navbar, TaskCard, StatCard, ProtectedRoute)
│   │   ├── pages/
│   │   │   ├── auth/Login.jsx
│   │   │   ├── admin/Dashboard.jsx, ManageEmployees.jsx, ManageTasks.jsx, AllWorkLogs.jsx
│   │   │   └── employee/MyTasks.jsx, TaskDetail.jsx, TaskHistory.jsx
│   │   ├── context/              # AuthContext (stores JWT + role)
│   │   ├── hooks/
│   │   ├── routes/               # role-based route guards
│   │   └── App.jsx
│   └── package.json
├── docs/
│   ├── ER-diagram.png
│   ├── postman_collection.json
│   └── api-endpoints.md
├── database/
│   └── schema.sql                # full DDL as a standalone script (in addition to Flyway migrations)
├── README.md
├── .env.example                  # dummy values, committed — shows evaluators what to fill in
└── .gitignore                    # must exclude .env, application-local.yml, node_modules, target/
```

Why this matters for the interview: you should be able to open this tree and narrate it in under a minute — "controller talks to service, service talks to repository, DTOs at the boundary, JWT filter runs before every request..."

---

## 2. Database Design (PostgreSQL)

**Goal:** "well-designed PostgreSQL database" — normalize properly, use constraints, use enums where sensible.

### Tables

**users**
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| full_name | VARCHAR(100) NOT NULL | |
| email | VARCHAR(150) UNIQUE NOT NULL | |
| password | VARCHAR(255) NOT NULL | BCrypt hash |
| role | VARCHAR(20) NOT NULL | CHECK ('ADMIN','EMPLOYEE') |
| department | VARCHAR(100) | nullable, employee-only field |
| is_active | BOOLEAN DEFAULT TRUE | soft-disable instead of delete |
| created_at | TIMESTAMP DEFAULT now() | |

**tasks**
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| title | VARCHAR(200) NOT NULL | |
| description | TEXT | |
| assigned_to | BIGINT FK → users(id) | employee |
| assigned_by | BIGINT FK → users(id) | admin |
| status | VARCHAR(20) NOT NULL DEFAULT 'PENDING' | CHECK ('PENDING','IN_PROGRESS','COMPLETED') |
| priority | VARCHAR(20) DEFAULT 'MEDIUM' | optional but shows depth: LOW/MEDIUM/HIGH |
| due_date | DATE | |
| created_at | TIMESTAMP DEFAULT now() | |
| updated_at | TIMESTAMP | update on status change |

**work_logs** (task notes / history — this is what "work notes" and "task history" map to)
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| task_id | BIGINT FK → tasks(id) | |
| employee_id | BIGINT FK → users(id) | |
| note | TEXT NOT NULL | |
| status_at_log | VARCHAR(20) | status when note was added |
| logged_at | TIMESTAMP DEFAULT now() | |

### Relationships
- `users (1) — (many) tasks` via `assigned_to`
- `users (1) — (many) tasks` via `assigned_by`
- `tasks (1) — (many) work_logs`

### Indexes
- Index on `tasks.assigned_to`, `tasks.status` (dashboard filters heavily on these)
- Unique index on `users.email`

Deliverable: write this as both a **Flyway migration** (`V1__init_schema.sql`) and a standalone **schema.sql** for the "PostgreSQL SQL Script" submission requirement. Add a `V2__seed_data.sql` with the sample admin/employee credentials pre-inserted (BCrypt-hashed), so evaluators can log in immediately.

---

## 3. Environment Variables & Secrets

**Goal:** no credentials or secrets hardcoded in source — this is part of "security implementation" grading.

### Backend (Spring Boot)
Spring Boot doesn't read `.env` natively, so use one of these (either is fine, document your choice in the README):
- **Option A (simplest):** add the `spring-dotenv` dependency, which lets Spring load a `.env` file automatically.
- **Option B:** reference environment variables directly in `application.yml` using `${VAR_NAME}` placeholders, and export them as real OS environment variables (or via IntelliJ/VS Code run configs) before starting the app.

Variables needed:
```
DB_URL=jdbc:postgresql://localhost:5432/taskmanager
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=some-long-random-base64-string
JWT_EXPIRATION_MS=86400000
```
`application.yml` should reference these as:
```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION_MS}
```

### Frontend (Vite)
Vite reads `.env` files automatically; variables must be prefixed `VITE_`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```
Used in code as `import.meta.env.VITE_API_BASE_URL`, so the Axios base URL is never hardcoded.

### Checklist
- [ ] `.env` (backend) and `.env` (frontend) both git-ignored
- [ ] `.env.example` committed at repo root (and/or inside `backend/` and `frontend/`) with dummy placeholder values
- [ ] README explains what to copy into `.env` before running

---

## 4. Backend — Spring Boot

### 3.1 Security & Auth (JWT)
- [ ] `POST /api/auth/login` — validates email/password, returns JWT + role + user info
- [ ] JWT contains: `sub` (user id/email), `role`, `iat`, `exp`
- [ ] `JwtFilter` (OncePerRequestFilter) validates token on every request, sets `SecurityContext`
- [ ] `SecurityConfig`: stateless session, role-based endpoint authorization (`hasRole("ADMIN")` vs `hasRole("EMPLOYEE")`)
- [ ] Passwords stored with `BCryptPasswordEncoder`
- [ ] No registration endpoint needed (per assignment: pre-seeded sample credentials) — but note this decision in README

### 3.2 Admin APIs
- [ ] `GET /api/admin/employees` — list all employees
- [ ] `POST /api/admin/employees` — create employee
- [ ] `PUT /api/admin/employees/{id}` — update / deactivate employee
- [ ] `POST /api/admin/tasks` — create + assign task
- [ ] `GET /api/admin/tasks` — view all tasks (with filters: status, employee, date range)
- [ ] `GET /api/admin/tasks/{id}/worklogs` — monitor work logs for a task
- [ ] `GET /api/admin/dashboard/stats` — returns `{ totalEmployees, totalTasks, pendingTasks, completedTasks, inProgressTasks }`

### 3.3 Employee APIs
- [ ] `GET /api/employee/tasks` — tasks assigned to logged-in employee
- [ ] `PATCH /api/employee/tasks/{id}/status` — update status (Pending/In Progress/Completed)
- [ ] `POST /api/employee/tasks/{id}/worklogs` — add a work note
- [ ] `GET /api/employee/tasks/history` — completed/past tasks

### 3.4 Validation & Exception Handling
- [ ] Use `jakarta.validation` (`@NotBlank`, `@Email`, `@NotNull`) on all DTOs
- [ ] `@RestControllerAdvice` + `GlobalExceptionHandler` catching: `MethodArgumentNotValidException`, `ResourceNotFoundException`, `AccessDeniedException`, generic `Exception` — all returning a consistent error JSON shape: `{ timestamp, status, message, path }`
- [ ] Custom exceptions: `ResourceNotFoundException`, `UnauthorizedActionException`, `DuplicateEmailException`

### 3.5 API Documentation
- [ ] Add `springdoc-openapi-starter-webmvc-ui` dependency → auto-generates Swagger UI at `/swagger-ui.html`
- [ ] Alternatively/also export a Postman collection (`docs/postman_collection.json`) — the assignment explicitly accepts either, doing both costs little and looks thorough

---

## 5. Frontend — React

### 4.1 Core Setup
- [ ] Vite + React, React Router v6 for routing
- [ ] Axios instance with interceptor attaching JWT from context/localStorage to every request
- [ ] `AuthContext` storing token + role + user, with `login()` / `logout()`
- [ ] `ProtectedRoute` component — redirects to `/login` if no token; redirects to correct dashboard if role mismatch

### 4.2 Shared
- [ ] `Login` page — single form, backend returns role, frontend redirects to `/admin` or `/employee` accordingly

### 4.3 Admin Screens
- [ ] **Dashboard** — 4 stat cards (Total Employees, Total Tasks, Pending, Completed) using the stats API
- [ ] **Manage Employees** — table + add/edit modal
- [ ] **Assign/Manage Tasks** — table of all tasks with filter by employee/status, create-task modal
- [ ] **Work Logs Monitor** — view notes/history per task

### 4.4 Employee Screens
- [ ] **My Tasks** — list assigned tasks with status dropdown (Pending/In Progress/Completed)
- [ ] **Task Detail** — view description, add work note, see note history for that task
- [ ] **Task History** — past/completed tasks

### 4.5 UX polish (cheap wins for evaluation)
- [ ] Loading states, empty states, basic error toasts
- [ ] Simple, clean styling (Tailwind or plain CSS — doesn't need to be fancy, needs to be uncluttered)

---

## 6. Submission Checklist (map directly to assignment requirements)

| Requirement | Status | Notes |
|---|---|---|
| GitHub Repository | ☐ | clean commit history, sensible `.gitignore` (node_modules, target/, .env) |
| PostgreSQL SQL Script / migration files | ☐ | `database/schema.sql` + Flyway `V1__`, `V2__` |
| README with setup instructions | ☐ | see §7 below |
| API Documentation (Swagger or Postman) | ☐ | Swagger UI + exported Postman collection |
| Sample login credentials (Admin & Employee) | ☐ | seeded via migration, listed in README |

---

## 7. README Structure (write this last, once everything works)

1. Project overview (1 paragraph)
2. Tech stack
3. Architecture diagram / folder structure summary
4. Prerequisites (Java version, Node version, PostgreSQL version)
5. Setup steps:
   - Clone repo
   - Create Postgres DB, set credentials in `application.yml` / `.env`
   - Run backend (`./mvnw spring-boot:run`) — migrations run automatically via Flyway
   - Run frontend (`npm install && npm run dev`)
6. Sample credentials table (Admin: email/password, Employee: email/password)
7. API docs link (`/swagger-ui.html`) and/or Postman collection path
8. Known limitations / things you'd improve with more time (shows self-awareness — good in interviews)

---

## 8. Suggested 3-Day Timeline

**Day 1 (Backend foundation)**
- Project scaffolding, DB schema + migrations, entities/repositories
- JWT auth end-to-end (login working, tested in Postman)
- Employee CRUD + Task CRUD APIs, validation, exception handling

**Day 2 (Backend finish + Frontend start)**
- Work logs APIs, dashboard stats API
- Swagger docs, Postman collection export
- React scaffolding, auth context, login page, protected routes
- Admin dashboard + employee management UI

**Day 3 (Frontend finish + polish + submission)**
- Task management UI (admin + employee sides), work log UI
- Task status update flow, task history
- End-to-end manual testing of both roles
- README, seed data double-check, push final commit
- Prepare a 2–3 minute verbal walkthrough of architecture for the interview round

---

## 9. Interview Prep Notes (for the round after submission)

Be ready to explain, out loud, without looking at the code:
- Why DTOs instead of exposing entities directly
- How the JWT filter chain works (request → filter → SecurityContext → controller)
- Why you chose Flyway (or plain SQL) for schema management
- How role-based access is enforced on both backend (`@PreAuthorize`/security config) and frontend (route guards)
- What you'd change if this needed to scale (pagination on task lists, caching dashboard stats, refresh tokens instead of long-lived JWTs)

---

### How to use this with Claude Code

Work through sections in order — §2 (database) → §3 (env vars) → §4 (backend) → §5 (frontend) → §7 (README). Each checkbox above is small enough to hand to Claude Code as a single task ("implement the JWT filter per §4.1", "build the Manage Employees page per §5.3"), which keeps commits atomic and reviewable.