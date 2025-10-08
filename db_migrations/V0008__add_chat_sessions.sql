-- Создаем таблицу для хранения диалогов
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) DEFAULT 'Новый диалог',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_favorite BOOLEAN DEFAULT false,
    message_count INTEGER DEFAULT 0
);

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_sessions_created ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_favorite ON chat_sessions(is_favorite);
