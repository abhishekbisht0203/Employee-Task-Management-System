-- Add more employees
INSERT INTO users (full_name, email, password, role, department, is_active, created_at)
VALUES
    ('Alice Johnson', 'alice@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'EMPLOYEE', 'Engineering', TRUE, '2026-01-15 09:00:00'),
    ('Bob Williams', 'bob@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'EMPLOYEE', 'Design', TRUE, '2026-02-20 10:30:00'),
    ('Carol Martinez', 'carol@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'EMPLOYEE', 'Marketing', TRUE, '2026-03-10 08:15:00'),
    ('David Brown', 'david@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'EMPLOYEE', 'Engineering', TRUE, '2026-04-05 11:00:00'),
    ('Eve Davis', 'eve@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'EMPLOYEE', 'Design', TRUE, '2026-05-12 14:20:00'),
    ('Frank Miller', 'frank@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'EMPLOYEE', 'Engineering', FALSE, '2026-06-01 09:45:00')
ON CONFLICT (email) DO NOTHING;

-- Tasks spanning multiple months with varied statuses
INSERT INTO tasks (title, description, assigned_to, assigned_by, status, priority, due_date, created_at, updated_at)
VALUES
    ('Design landing page', 'Create a modern landing page for the product launch', 2, 1, 'COMPLETED', 'HIGH', '2026-01-30', '2026-01-10 10:00:00', '2026-01-25 16:30:00'),
    ('Set up CI/CD pipeline', 'Configure GitHub Actions for automated deployment', 3, 1, 'COMPLETED', 'HIGH', '2026-02-15', '2026-02-01 09:00:00', '2026-02-12 14:00:00'),
    ('User research interviews', 'Conduct 10 user interviews for feedback', 5, 1, 'COMPLETED', 'MEDIUM', '2026-03-20', '2026-03-05 11:00:00', '2026-03-18 10:30:00'),
    ('Database optimization', 'Optimize slow queries and add indexes', 4, 1, 'COMPLETED', 'HIGH', '2026-04-10', '2026-03-25 08:00:00', '2026-04-08 15:45:00'),
    ('Email notification system', 'Implement email notifications for task assignments', 3, 1, 'COMPLETED', 'MEDIUM', '2026-05-15', '2026-04-20 10:00:00', '2026-05-10 12:00:00'),
    ('Dashboard analytics', 'Build analytics widgets for the admin dashboard', 2, 1, 'COMPLETED', 'HIGH', '2026-06-20', '2026-06-01 09:00:00', '2026-06-18 17:00:00'),
    ('Mobile responsive fixes', 'Fix responsive issues on mobile devices', 2, 1, 'IN_PROGRESS', 'MEDIUM', '2026-08-15', '2026-07-01 10:00:00', '2026-07-25 11:30:00'),
    ('API documentation', 'Write OpenAPI/Swagger docs for all endpoints', 4, 1, 'IN_PROGRESS', 'LOW', '2026-08-01', '2026-07-05 14:00:00', '2026-07-26 09:00:00'),
    ('Performance testing', 'Load test the application with 1000 concurrent users', 3, 1, 'PENDING', 'HIGH', '2026-08-30', '2026-07-10 08:30:00', '2026-07-10 08:30:00'),
    ('Security audit', 'Review and fix security vulnerabilities', 4, 1, 'PENDING', 'HIGH', '2026-09-15', '2026-07-15 11:00:00', '2026-07-15 11:00:00'),
    ('Dark mode support', 'Add dark mode toggle across the application', 2, 1, 'PENDING', 'LOW', '2026-09-01', '2026-07-20 09:00:00', '2026-07-20 09:00:00'),
    ('Data export feature', 'Allow exporting reports as CSV/PDF', 3, 1, 'PENDING', 'MEDIUM', '2026-09-30', '2026-07-25 10:00:00', '2026-07-25 10:00:00')
ON CONFLICT DO NOTHING;

-- Work logs for completed and in-progress tasks
INSERT INTO work_logs (task_id, employee_id, note, status_at_log, logged_at)
VALUES
    (1, 2, 'Designed hero section and navigation', 'IN_PROGRESS', '2026-01-15 14:00:00'),
    (1, 2, 'Completed all sections, ready for review', 'COMPLETED', '2026-01-25 16:30:00'),
    (2, 3, 'Set up GitHub Actions workflows', 'IN_PROGRESS', '2026-02-08 11:00:00'),
    (2, 3, 'Pipeline passing, deployment working', 'COMPLETED', '2026-02-12 14:00:00'),
    (3, 5, 'Completed 5 interviews today', 'IN_PROGRESS', '2026-03-12 15:30:00'),
    (3, 5, 'All interviews done, compiling report', 'COMPLETED', '2026-03-18 10:30:00'),
    (4, 4, 'Identified 3 slow queries, added indexes', 'IN_PROGRESS', '2026-04-02 09:15:00'),
    (4, 4, 'Query time reduced by 80%, optimization complete', 'COMPLETED', '2026-04-08 15:45:00'),
    (5, 3, 'Integrated SendGrid for email delivery', 'IN_PROGRESS', '2026-05-01 10:00:00'),
    (5, 3, 'Email templates and notification logic done', 'COMPLETED', '2026-05-10 12:00:00'),
    (6, 2, 'Chart components rendering with real data', 'IN_PROGRESS', '2026-06-10 13:00:00'),
    (6, 2, 'All dashboard widgets functional', 'COMPLETED', '2026-06-18 17:00:00'),
    (7, 2, 'Fixed sidebar and navbar responsive issues', 'IN_PROGRESS', '2026-07-20 10:30:00'),
    (8, 4, 'Started documenting user and task endpoints', 'IN_PROGRESS', '2026-07-22 14:00:00')
ON CONFLICT DO NOTHING;