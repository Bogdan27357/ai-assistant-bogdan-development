CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    model VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_created ON chat_messages(created_at);

CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user_settings (setting_key, setting_value) VALUES
    ('temperature', '0.7'),
    ('max_tokens', '2048'),
    ('system_prompt', 'Ты — полезный ИИ-ассистент Богдан. Отвечай кратко и по делу.')
ON CONFLICT (setting_key) DO NOTHING;