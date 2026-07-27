# Employee Task Management System

A full-stack employee task management application built with Spring Boot (backend) and React (frontend), featuring JWT-based authentication and role-based access control for Admin and Employee users.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Frontend | React 18, Vite, React Router v6, Axios |
| Database | PostgreSQL |
| Auth | JWT (jjwt 0.12.3), BCrypt |
| Schema Mgmt | Flyway |
| API Docs | Swagger UI (springdoc-openapi) |

## Project Structure

```
employee-task-management/
├── .env.example                     # Env var template
├── .gitignore
├── backend/                         # Spring Boot application
│   ├── .env.example                 # DB + JWT env var template
│   ├── .mvn/wrapper/                # Maven wrapper
│   ├── mvnw.cmd                     # Maven wrapper (Windows)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/eventxplora/taskmanager/
│       │   ├── config/              # SecurityConfig, CorsConfig, SwaggerConfig
│       │   ├── controller/          # AuthController, AdminController, EmployeeController, DashboardController
│       │   ├── dto/                 # 11 Request/Response DTOs
│       │   ├── entity/              # User, Task, WorkLog, enums (Role, TaskStatus, Priority)
│       │   ├── exception/           # GlobalExceptionHandler + 3 custom exceptions
│       │   ├── repository/          # UserRepository, TaskRepository, WorkLogRepository
│       │   ├── security/            # JwtUtil, JwtFilter, UserDetailsServiceImpl
│       │   ├── service/             # 5 interfaces + implementations
│       │   └── TaskManagerApplication.java
│       └── resources/
│           ├── application.yml      # Uses ${VAR_NAME} placeholders
│           └── db/migration/        # V1__init_schema.sql, V2__seed_data.sql
├── database/
│   └── schema.sql                   # Standalone DDL + seed data
├── docs/
│   ├── api-endpoints.md             # Full API reference
│   └── postman_collection.json      # Importable Postman collection
├── frontend/                        # React (Vite) application
│   ├── .env.example                 # VITE_API_BASE_URL template
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/                     # axios.js, auth.js, admin.js, employee.js
│       ├── components/              # Navbar, ProtectedRoute, StatCard, TaskCard
│       ├── context/                 # AuthContext (JWT + role state)
│       ├── pages/
│       │   ├── auth/Login.jsx
│       │   ├── admin/               # Dashboard, ManageEmployees, ManageTasks, AllWorkLogs
│       │   └── employee/            # MyTasks, TaskDetail, TaskHistory
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## Prerequisites

- **Java 17** or later
- **Node.js 18** or later
- **PostgreSQL 14** or later
- **Maven** (or use the included `mvnw` wrapper)

## Setup Instructions

### 1. Clone and Configure Database

```bash
git clone <repo-url>
cd employee-task-management
```

Create a PostgreSQL database:

```sql
CREATE DATABASE taskmanager;
```

### 2. Configure Environment Variables

The backend uses environment variables for all secrets. Copy the template and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend (optional — defaults work for local dev)
cp frontend/.env.example frontend/.env
```

**`backend/.env`:**
```env
DB_URL=jdbc:postgresql://localhost:5432/taskmanager
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=base64-encoded-secret-key-at-least-256-bits-long
JWT_EXPIRATION_MS=86400000
```

> Spring Boot loads `.env` automatically via `spring-dotenv` (included in dependencies).  
> If you prefer OS-level env vars, export them directly and they will override the `.env` values.

**`frontend/.env`:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> If `VITE_API_BASE_URL` is not set, the frontend defaults to `/api` and uses Vite's dev proxy (configured in `vite.config.js`).

### 3. Run Backend

```bash
cd backend
# On Linux/Mac:
./mvnw spring-boot:run
# On Windows (PowerShell):
.\mvnw.cmd spring-boot:run
```

Flyway migrations run automatically on startup, creating tables and seeding sample data.

### 4. Run Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173** and proxies `/api` requests to the backend at `http://localhost:8080`.

## Sample Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@eventxplora.com | admin123 |
| **Employee** | employee@eventxplora.com | employee123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` — Login with email/password, returns JWT token

### Admin Endpoints (requires ADMIN role)
- `GET /api/admin/employees` — List all employees
- `POST /api/admin/employees` — Create new employee
- `PUT /api/admin/employees/{id}` — Update/deactivate employee
- `POST /api/admin/tasks` — Create and assign task
- `GET /api/admin/tasks` — List all tasks (filterable by status, employee, date range)
- `GET /api/admin/tasks/{id}/worklogs` — View work logs for a task
- `GET /api/admin/dashboard/stats` — Dashboard statistics

### Employee Endpoints (requires EMPLOYEE role)
- `GET /api/employee/tasks` — My assigned tasks
- `GET /api/employee/tasks/{id}` — Task details
- `PATCH /api/employee/tasks/{id}/status` — Update task status
- `POST /api/employee/tasks/{id}/worklogs` — Add work note
- `GET /api/employee/tasks/{id}/worklogs` — View task work logs
- `GET /api/employee/tasks/history` — Completed tasks history

## API Documentation

- **Swagger UI**: Available at `http://localhost:8080/swagger-ui.html` when backend is running
- **Postman Collection**: See `docs/postman_collection.json`

## Key Design Decisions

- **DTOs instead of entities**: Controllers never expose JPA entities directly. DTOs decouple the API contract from the persistence layer.
- **JWT auth**: Stateless authentication using JSON Web Tokens. Tokens contain userId, email, and role.
- **Flyway migrations**: Database schema versioning that runs automatically on startup, ensuring consistency.
- **Role-based access**: Backend enforces via `SecurityConfig` route rules and `@PreAuthorize`; frontend enforces via `ProtectedRoute` component and role-based nav links.
- **Environment variables**: All secrets (DB credentials, JWT secret) are externalized via `.env` files using `spring-dotenv` — no hardcoded credentials in source code.
- **Soft deletes**: Employees are deactivated (`is_active = false`) rather than deleted, preserving referential integrity.
- **No registration endpoint**: Users are pre-seeded or created by admin only, per the assignment requirements.

## Known Limitations & Future Improvements

- **Pagination**: Task lists don't have pagination — would add Spring Data `Pageable` for production scaling.
- **Refresh tokens**: Currently using long-lived JWTs (24h). Refresh tokens would improve security.
- **Dashboard caching**: Stats are computed live. Would cache with periodic refresh for performance.
- **Email notifications**: No notification system for task assignments. Could add email/Slack integration.
- **File uploads**: Work logs are text-only. Could support attachments.

## License

This project was built for a technical assessment at EventXplora Pvt. Ltd.