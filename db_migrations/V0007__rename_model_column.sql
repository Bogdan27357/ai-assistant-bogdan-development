-- Переименовываем колонку model в model_id для единообразия
ALTER TABLE chat_messages RENAME COLUMN model TO model_id;

-- Добавляем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_model_id ON chat_messages(model_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
