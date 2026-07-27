-- Admin credentials: admin@eventxplora.com / admin123
-- Employee credentials: employee@eventxplora.com / employee123

INSERT INTO users (full_name, email, password, role, department, is_active)
VALUES
    ('Admin User', 'admin@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.pvG8.4SB3EfDTuzzyjZIkaqgOuBP1ka', 'ADMIN', NULL, TRUE),
    ('John Doe', 'employee@eventxplora.com', '$2b$10$TkP2aNKvaBsTGfuqayZap.zkQcx7MBMXCp4mpNj/8D3u1Z4nWqx.y', 'EMPLOYEE', 'Engineering', TRUE)
ON CONFLICT (email) DO NOTHING;
