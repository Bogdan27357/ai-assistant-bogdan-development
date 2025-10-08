-- Создание таблицы для хранения сообщений и статистики использования моделей
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    model_id VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Индексы для быстрых запросов
    INDEX idx_session_id (session_id),
    INDEX idx_model_id (model_id),
    INDEX idx_created_at (created_at)
);

-- Создание таблицы для хранения API ключей
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    model_id VARCHAR(50) NOT NULL UNIQUE,
    api_key TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы для хранения файлов базы знаний
CREATE TABLE IF NOT EXISTS knowledge_files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);