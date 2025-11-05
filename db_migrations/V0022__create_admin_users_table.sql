CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin: admin@ai-platform.com / admin123
INSERT INTO admin_users (email, password_hash, is_admin) 
VALUES ('admin@ai-platform.com', '$2b$10$rQ8KX8y7nXZ7R5F5F5F5F5euOVOqJ4vU0mxJ4vU0mxJ4vU0mxJ4vU', true)
ON CONFLICT (email) DO NOTHING;