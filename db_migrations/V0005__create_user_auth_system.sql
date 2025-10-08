-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Таблица сессий пользователей
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица настроек пользователя
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    language VARCHAR(10) DEFAULT 'ru',
    voice_enabled BOOLEAN DEFAULT FALSE,
    voice_type VARCHAR(50) DEFAULT 'female',
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица истории чатов пользователя
CREATE TABLE IF NOT EXISTS user_chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255) NOT NULL,
    model VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Добавляем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_history_user_id ON user_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_chat_history_session_id ON user_chat_history(session_id);

-- Создаем администратора по умолчанию (пароль: admin123)
INSERT INTO users (email, password_hash, name, is_admin) 
VALUES ('admin@ai-platform.com', '$2b$10$XqZ7k9K8vVJ5yGxQ3YmXZOXQJZ3Z8K5vJ9yGxQ3YmXZOXQJZ3Z8K5', 'Administrator', TRUE)
ON CONFLICT (email) DO NOTHING;
