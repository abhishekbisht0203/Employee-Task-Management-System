ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(20);

UPDATE users SET employee_id = 'EMP' || LPAD(id::text, 4, '0') WHERE employee_id IS NULL;

ALTER TABLE users ALTER COLUMN employee_id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);