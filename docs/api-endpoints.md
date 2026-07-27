# API Endpoints

## Authentication

### POST /api/auth/login
Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "admin@eventxplora.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ADMIN",
  "userId": 1,
  "fullName": "Admin User",
  "email": "admin@eventxplora.com"
}
```

**Error Responses:**
- `404` — Invalid email or password
- `401` — Account is deactivated

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` header.

### GET /api/admin/employees
Returns all employees.

**Response (200):**
```json
[
  {
    "id": 2,
    "fullName": "John Doe",
    "email": "employee@eventxplora.com",
    "role": "EMPLOYEE",
    "department": "Engineering",
    "isActive": true,
    "createdAt": "2026-07-27T11:38:00"
  }
]
```

### POST /api/admin/employees
Creates a new employee.

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@eventxplora.com",
  "password": "password123",
  "department": "Design"
}
```

**Response (201):** Employee object

### PUT /api/admin/employees/{id}
Updates an existing employee.

**Request Body:**
```json
{
  "fullName": "Jane Smith Updated",
  "email": "jane@eventxplora.com",
  "department": "Product",
  "isActive": true
}
```

**Response (200):** Updated employee object

### POST /api/admin/tasks
Creates and assigns a task.

**Request Body:**
```json
{
  "title": "Fix login page bug",
  "description": "Users cannot login with special characters in password",
  "assignedTo": 2,
  "priority": "HIGH",
  "dueDate": "2026-08-10"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Fix login page bug",
  "description": "Users cannot login with special characters in password",
  "assignedToId": 2,
  "assignedToName": "John Doe",
  "assignedToEmail": "employee@eventxplora.com",
  "assignedById": 1,
  "assignedByName": "Admin User",
  "status": "PENDING",
  "priority": "HIGH",
  "dueDate": "2026-08-10",
  "createdAt": "2026-07-27T11:38:00",
  "updatedAt": "2026-07-27T11:38:00"
}
```

### GET /api/admin/tasks
Returns all tasks with optional filters.

**Query Parameters:** `status`, `employeeId`, `fromDate`, `toDate`

**Response (200):** Array of task objects

### GET /api/admin/tasks/{id}/worklogs
Returns work logs for a specific task.

**Response (200):**
```json
[
  {
    "id": 1,
    "taskId": 1,
    "employeeId": 2,
    "employeeName": "John Doe",
    "note": "Fixed the password validation issue",
    "statusAtLog": "IN_PROGRESS",
    "loggedAt": "2026-07-27T12:00:00"
  }
]
```

### GET /api/admin/dashboard/stats
Returns dashboard statistics.

**Response (200):**
```json
{
  "totalEmployees": 1,
  "totalTasks": 10,
  "pendingTasks": 4,
  "inProgressTasks": 3,
  "completedTasks": 3
}
```

---

## Employee Endpoints

All employee endpoints require `Authorization: Bearer <token>` header.

### GET /api/employee/tasks
Returns tasks assigned to the logged-in employee that are not yet completed.

**Response (200):** Array of task objects

### GET /api/employee/tasks/{id}
Returns a specific task by ID.

**Response (200):** Task object

### PATCH /api/employee/tasks/{id}/status
Updates the status of a task.

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Valid values:** `PENDING`, `IN_PROGRESS`, `COMPLETED`

**Response (200):** Updated task object

### POST /api/employee/tasks/{id}/worklogs
Adds a work note to a task.

**Request Body:**
```json
{
  "note": "Fixed the validation logic and added unit tests"
}
```

**Response (201):**
```json
{
  "id": 1,
  "taskId": 1,
  "employeeId": 2,
  "employeeName": "John Doe",
  "note": "Fixed the validation logic and added unit tests",
  "statusAtLog": "IN_PROGRESS",
  "loggedAt": "2026-07-27T12:30:00"
}
```

### GET /api/employee/tasks/{id}/worklogs
Returns work logs for a specific task.

**Response (200):** Array of work log objects

### GET /api/employee/tasks/history
Returns completed tasks for the logged-in employee.

**Response (200):** Array of completed task objects

---

## Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "timestamp": "2026-07-27T11:38:00",
  "status": 404,
  "message": "Employee not found with id: 99",
  "path": "/api/admin/employees/99"
}
```

Validation errors include an additional `errors` field:

```json
{
  "timestamp": "2026-07-27T11:38:00",
  "status": 400,
  "message": "Validation failed",
  "path": "/api/admin/employees",
  "errors": {
    "email": "Email is required",
    "fullName": "Full name is required"
  }
}
```